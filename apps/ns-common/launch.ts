import { Application } from '@nativescript/core';

// Delivers xplatbench:// URLs from cold and warm launches on both platforms.
// Call before Application.run(). iOS apps using scenes receive the cold-launch
// URL in the scene connection options; warm opens go through the legacy
// applicationOpenURLOptions handler, which core forwards from the scene.

export function onLaunchUrl(handler: (url: string) => void): void {
  let last = '';
  let lastAt = 0;
  const deliver = (url: string | null | undefined) => {
    if (!url || !url.startsWith('xplatbench:')) return;
    const now = Date.now();
    if (url === last && now - lastAt < 2000) return; // same URL via two paths
    last = url;
    lastAt = now;
    // Let the first frame and the root view settle before starting work.
    setTimeout(() => handler(url), 0);
  };

  if (__APPLE__) {
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
