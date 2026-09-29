import { Application } from '@nativescript/core';

export function onLaunchUrl(handler: (url: string) => void): void {
  let last = '';
  let lastAt = 0;
  const deliver = (url: string | null | undefined) => {
    if (!url || !url.startsWith('xplatbench')) return;
    const now = Date.now();
    if (url === last && now - lastAt < 2000) return;
    last = url;
    lastAt = now;
    setTimeout(() => handler(url), 0);
  };

  if (__APPLE__) {
    Application.on(Application.launchEvent, () => {
      deliver(NSProcessInfo.processInfo.environment.objectForKey('XPLATBENCH_URL') as string | null);
    });
    Application.ios.addDelegateHandler('applicationOpenURLOptions', (_app, url: NSURL) => {
      deliver(url.absoluteString);
      return true;
    });
    (Application.ios as any).on('sceneWillConnect', (args: any) => {
      const contexts = args.connectionOptions?.URLContexts?.allObjects;
      for (let i = 0; i < (contexts?.count ?? 0); i++) deliver(contexts.objectAtIndex(i).URL.absoluteString);
    });
    Application.on(Application.launchEvent, (args: any) => {
      const url = args.ios?.objectForKey?.(UIApplicationLaunchOptionsURLKey) as NSURL | undefined;
      if (url) deliver(url.absoluteString);
    });
  } else {
    Application.on(Application.launchEvent, (args: any) => {
      deliver(args.android?.getData?.()?.toString());
    });
    Application.android.on('activityNewIntent', (args: any) => {
      deliver(args.intent?.getData?.()?.toString());
    });
  }
}
