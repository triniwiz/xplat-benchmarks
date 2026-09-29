import { bootstrapApplication, runNativeScriptAngularApp } from '@nativescript/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/angular';
import { onLaunchUrl } from './ns-common/launch';
import { AppComponent } from './app/app.component';
import { launchUrls } from './app/bench.service';

// Mason elements (<View>, <Text>, ...) for templates. Web tags (<div>, ...) are
// not used: they map to Div, a scroll container, where the benchmark uses View.
installMasonKit({ web: false });

// Must be registered before the app starts; URLs are queued until the bench service exists.
onLaunchUrl((url) => launchUrls.push(url));

runNativeScriptAngularApp({
  appModuleBootstrap: () =>
    bootstrapApplication(AppComponent, {
      providers: [provideZonelessChangeDetection()],
    }),
});
