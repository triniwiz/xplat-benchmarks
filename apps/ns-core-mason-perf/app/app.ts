import { startShell } from './ns-common/shell';
import { masonChrome } from './chrome';
import { build } from './scenarios';

startShell({ app: 'ns-core-mason-perf', title: 'NativeScript Core + Mason (perf branch)', build, chrome: masonChrome() });
