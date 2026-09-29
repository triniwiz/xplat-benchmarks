import { bootstrapApplication, runNativeScriptAngularApp } from '@nativescript/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/angular';
import { onLaunchUrl } from './ns-common/launch';
import { AppComponent } from './app/app.component';
import { launchQueue } from './ns-common/controller';

installMasonKit({ web: false });

onLaunchUrl((url) => launchQueue.push(url));

runNativeScriptAngularApp({
  appModuleBootstrap: () =>
    bootstrapApplication(AppComponent, {
      providers: [provideZonelessChangeDetection()],
    }),
});
