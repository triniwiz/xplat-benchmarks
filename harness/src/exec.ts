import { execFile } from 'node:child_process';

export interface ExecResult {
  stdout: string;
  stderr: string;
}

export function run(cmd: string, args: readonly string[], opts: { timeoutMs?: number } = {}): Promise<ExecResult> {
  return new Promise((resolve, reject) => {
    execFile(
      cmd,
      args,
      { timeout: opts.timeoutMs ?? 120_000, maxBuffer: 64 * 1024 * 1024 },
      (err, stdout, stderr) => {
        if (err) {
          const e = err as Error & { stderr?: string };
          e.message = `${cmd} ${args.join(' ')} failed: ${e.message}\n${stderr}`.trim();
          e.stderr = stderr;
          reject(e);
        } else {
          resolve({ stdout, stderr });
        }
      },
    );
  });
}

export async function tryRun(cmd: string, args: readonly string[]): Promise<ExecResult | null> {
  try {
    return await run(cmd, args);
  } catch {
    return null;
  }
}
