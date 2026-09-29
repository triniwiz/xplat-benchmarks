import { createApp } from 'nativescript-vue';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/vue';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import App from './App.vue';

installMasonKit({ web: false });

onLaunchUrl((url) => launchQueue.push(url));

createApp(App).start();
