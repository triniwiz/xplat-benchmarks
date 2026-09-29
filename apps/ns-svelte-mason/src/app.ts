import { svelteNativeNoFrame } from 'svelte-native';
import { installMasonKit } from '@triniwiz/nativescript-masonkit/svelte';
import { onLaunchUrl } from './ns-common/launch';
import { launchQueue } from './ns-common/controller';
import App from './App.svelte';

// Mason elements (view, text, scroll, ul, ...). Web tags are not used: they
// map to Div, a scroll container, where the benchmark uses View.
installMasonKit({ web: false });

// Must be registered before the app starts; URLs queue until the controller exists.
onLaunchUrl((url) => launchQueue.push(url));

// No Frame/Page: the root is the same GridLayout frame the other apps use.
svelteNativeNoFrame(App, {});
