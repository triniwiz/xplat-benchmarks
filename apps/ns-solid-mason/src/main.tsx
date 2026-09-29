import { render } from '@nativescript-community/solid-js';
import { Application } from '@nativescript/core';
import { document } from 'dominative';
import { registerMasonElements } from './ns-dominative/mason-elements';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import { App } from './App';

// After the solid-js import (which lowercases dominative tags), so Mason's `text` wins.
registerMasonElements();

// Must be registered before the app starts; URLs queue until the controller exists.
onLaunchUrl((url) => launchQueue.push(url));

// dominative mounts into document.body, a Page (action bar hidden) in a Frame.
Application.run({
  create: () => {
    render(() => <App />, document.body);
    return document;
  },
});
