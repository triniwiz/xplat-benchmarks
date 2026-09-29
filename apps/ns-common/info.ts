import { Device, Screen } from '@nativescript/core';
import type { BenchAdapter } from '../shared/runner';

declare const __BENCH_VERSIONS__: Record<string, string>;

export function deviceInfo(): ReturnType<BenchAdapter['info']> {
  return {
    platform: __APPLE__ ? 'ios' : 'android',
    osVersion: Device.osVersion,
    deviceModel: `${Device.manufacturer} ${Device.model}`,
    framework: typeof __BENCH_VERSIONS__ === 'object' ? __BENCH_VERSIONS__ : {},
    screenWidth: Screen.mainScreen.widthDIPs,
  };
}
