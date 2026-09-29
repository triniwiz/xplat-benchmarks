import { render } from '@nativescript-community/solid-js';
import { Application } from '@nativescript/core';
import { document } from 'dominative';
import { registerMasonElements } from './ns-dominative/mason-elements';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import { App } from './App';

registerMasonElements();

onLaunchUrl((url) => launchQueue.push(url));

Application.run({
  create: () => {
    render(() => <App />, document.body);
    return document;
  },
});
