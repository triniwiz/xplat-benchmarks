import { svelteNativeNoFrame } from 'svelte-native';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/svelte';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import App from './App.svelte';

installMasonKit({ web: false });

onLaunchUrl((url) => launchQueue.push(url));

svelteNativeNoFrame(App, {});
