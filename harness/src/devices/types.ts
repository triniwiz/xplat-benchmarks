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
  prepare(port: number): Promise<string>;
  isInstalled(bundleId: string): Promise<boolean>;
  launchUrl(bundleId: string, url: string, activity?: string): Promise<void>;
  stop(bundleId: string): Promise<void>;
  install(artifactPath: string): Promise<void>;
  memory?(bundleId: string): Promise<Record<string, number> | undefined>;
  forceGc?(bundleId: string): Promise<void>;
  screenshot(outPath: string): Promise<void>;
  describe(): Promise<Record<string, string>>;
}
