import { AppRegistry, Image, Platform, processColor } from 'react-native';
import { mount } from '@ng-native/platform';
import { currentConditions, deviceTokens, watchConditions } from '@ng-native/device';
import { getFabricUIManager, registerPlatformComponents } from '@ng-native/fabric';
import { App } from './app/app.ts';
import { setLaunchUrl } from './app/bench.ts';

registerPlatformComponents(Platform.OS);

AppRegistry.registerRunnable('main', ({ rootTag, initialProps }: { rootTag: number | string; initialProps?: { launchUrl?: string } }) => {
  setLaunchUrl(initialProps?.launchUrl);
  const app = mount(Number(rootTag), App, getFabricUIManager(), {
    processColor,
    conditions: currentConditions(),
    tokens: deviceTokens(),
    resolveAssetSource: (value) => Image.resolveAssetSource(value as never),
  });
  watchConditions(app.engine);
});
