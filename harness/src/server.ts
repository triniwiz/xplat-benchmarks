import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { CaseResult, DoneMessage, Plan, RunInfo } from '../../scenarios/src/protocol';

// Serves plans to apps and collects their results. One server handles many
// runs; each run is keyed by runId (from the deep link).

export interface RunRecord {
  plan: Plan;
  info?: RunInfo;
  cases: CaseResult[];
  done?: DoneMessage;
  /** Set when waitForDone gave up. */
  timedOut?: boolean;
}

interface PendingRun {
  record: RunRecord;
  lastSeen: number;
  resolve: () => void;
  finished: Promise<void>;
  onProgress?: (msg: string) => void;
}

export interface BenchServer {
  port: number;
  /** Register a plan and get a promise that settles when the app reports done or on timeout. */
  /**
   * Register a plan; settles when the app reports done, after timeoutMs, or
   * after idleTimeoutMs without any request from the app (a dead or unreachable app).
   */
  addRun(plan: Plan, opts: { timeoutMs: number; idleTimeoutMs?: number; onProgress?: (msg: string) => void }): Promise<RunRecord>;
  close(): Promise<void>;
}

const MAX_BODY = 32 * 1024 * 1024;

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => {
      size += c.length;
      if (size > MAX_BODY) {
        reject(new Error('body too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function send(res: ServerResponse, status: number, body: unknown): void {
  const text = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(status, { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(text) });
  res.end(text);
}

export function startServer(port: number, log: (msg: string) => void = () => {}): Promise<BenchServer> {
  const runs = new Map<string, PendingRun>();

  const lookup = (runId: unknown): PendingRun | undefined => (typeof runId === 'string' ? runs.get(runId) : undefined);

  const handle = async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url ?? '/', 'http://localhost');
    if (req.method === 'GET' && url.pathname === '/plan') {
      const run = lookup(url.searchParams.get('run'));
      if (!run) return send(res, 404, { error: 'unknown run' });
      run.lastSeen = Date.now();
      run.onProgress?.('plan fetched');
      return send(res, 200, run.record.plan);
    }
    if (req.method === 'GET' && url.pathname === '/health') return send(res, 200, { ok: true });
    if (req.method !== 'POST') return send(res, 404, { error: 'not found' });

    let body: any;
    try {
      body = JSON.parse(await readBody(req));
    } catch (e) {
      return send(res, 400, { error: `bad json: ${e}` });
    }
    const run = lookup(body?.runId);
    if (!run) return send(res, 404, { error: 'unknown run' });
    run.lastSeen = Date.now();

    switch (url.pathname) {
      case '/hello':
        run.record.info = body as RunInfo;
        run.onProgress?.(`hello from ${body.platform} ${body.deviceModel ?? ''} ${body.osVersion ?? ''}`.trim());
        break;
      case '/case': {
        const c = body as CaseResult;
        run.record.cases.push(c);
        const n = run.record.cases.length;
        run.onProgress?.(
          `case ${n}/${run.record.plan.cases.length} ${c.scenario}/${c.size}${c.error ? ` ERROR ${c.error}` : ''}`,
        );
        break;
      }
      case '/done':
        run.record.done = body as DoneMessage;
        run.onProgress?.(`done (${body.ok ? 'ok' : `failed: ${body.error}`})`);
        run.resolve();
        break;
      default:
        return send(res, 404, { error: 'not found' });
    }
    send(res, 200, { ok: true });
  };

  const server: Server = createServer((req, res) => {
    handle(req, res).catch((e) => {
      log(`server error: ${e}`);
      if (!res.headersSent) send(res, 500, { error: String(e) });
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '0.0.0.0', () => {
      const address = server.address();
      const actualPort = typeof address === 'object' && address ? address.port : port;
      resolve({
        port: actualPort,
        addRun(plan, opts) {
          let resolveRun!: () => void;
          const finished = new Promise<void>((r) => (resolveRun = r));
          const pending: PendingRun = {
            record: { plan, cases: [] },
            lastSeen: Date.now(),
            resolve: resolveRun,
            finished,
            onProgress: opts.onProgress,
          };
          runs.set(plan.runId, pending);
          const giveUp = (why: string) => {
            pending.record.timedOut = true;
            opts.onProgress?.(why);
            resolveRun();
          };
          const timer = setTimeout(() => giveUp(`timed out after ${opts.timeoutMs} ms`), opts.timeoutMs);
          const idleMs = opts.idleTimeoutMs ?? 30 * 60_000;
          const idle = setInterval(() => {
            if (Date.now() - pending.lastSeen > idleMs) giveUp(`no request from the app for ${idleMs / 1000}s`);
          }, 5_000);
          return finished.then(() => {
            clearTimeout(timer);
            clearInterval(idle);
            runs.delete(plan.runId);
            return pending.record;
          });
        },
        close: () => new Promise<void>((r) => server.close(() => r())),
      });
    });
  });
}
