import { Application } from '@nativescript/core';
import { startReactApp } from '@nativescript-community/react';
import { registerMasonElements } from './ns-dominative/mason-elements';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import { App } from './App';

registerMasonElements();

onLaunchUrl((url) => launchQueue.push(url));

startReactApp({ Application, root: <App /> });
