export type Platform = 'ios' | 'android';

export interface Target {
  platform: Platform;
  id: string;
  name: string;
  kind: 'device' | 'simulator' | 'emulator';
  osVersion?: string;
}

export interface DeviceDriver {
  target: Target;
  /** Make the harness reachable from the device and return the host:port apps should call. */
  prepare(port: number): Promise<string>;
  isInstalled(bundleId: string): Promise<boolean>;
  /** Cold-launch the app with a deep link (terminating any running instance first). */
  launchUrl(bundleId: string, url: string, activity?: string): Promise<void>;
  stop(bundleId: string): Promise<void>;
  /** Save a PNG of the current screen. */
  screenshot(outPath: string): Promise<void>;
  /** Free-form device facts recorded with every result file. */
  describe(): Promise<Record<string, string>>;
}
