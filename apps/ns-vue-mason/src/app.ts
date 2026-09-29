import { createApp } from 'nativescript-vue';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/vue';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import App from './App.vue';

// Mason elements (View, Text, Scroll, Ul, ...) for templates. Web tags are not
// used: they map to Div, a scroll container, where the benchmark uses View.
installMasonKit({ web: false });

// Must be registered before the app starts; URLs queue until the controller exists.
onLaunchUrl((url) => launchQueue.push(url));

createApp(App).start();
