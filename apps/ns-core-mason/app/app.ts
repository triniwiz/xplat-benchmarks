import { startShell } from './ns-common/shell';
import { masonChrome } from './chrome';
import { masonDiagnostics } from './ns-common/mason-diagnostics';
import { build } from './scenarios';

startShell({ app: 'ns-core-mason', title: 'NativeScript Core + Mason', build, chrome: masonChrome(), diagnostics: masonDiagnostics });
