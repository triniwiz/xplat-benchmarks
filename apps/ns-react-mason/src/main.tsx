import { Application } from '@nativescript/core';
import { startReactApp } from '@nativescript-community/react';
import { registerMasonElements } from './ns-dominative/mason-elements';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import { App } from './App';

registerMasonElements();

// Must be registered before the app starts; URLs queue until the controller exists.
onLaunchUrl((url) => launchQueue.push(url));

// dominative mounts into document.body, a Page (action bar hidden) in a Frame.
startReactApp({ Application, root: <App /> });
