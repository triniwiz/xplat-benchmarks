const webpack = require('@nativescript/webpack');
const { benchDefines } = require('../ns-common/webpack-versions.cjs');

module.exports = (env) => {
  webpack.init(env);
  webpack.chainWebpack((config) => {
    config.plugin('DefinePlugin').tap((args) => {
      Object.assign(args[0], benchDefines(__dirname));
      return args;
    });
    config.resolve.extensions.prepend('.tsx').prepend('.jsx');
    config.resolve.alias.set('nsjsx/jsx-runtime', require('path').resolve(__dirname, 'src/nsjsx/jsx-runtime.ts'));
    config.module
      .rule('tsx')
      .test(/\.tsx$/)
      .use('ts-loader')
      .loader('ts-loader')
      .options({ transpileOnly: true, allowTsInNodeModules: true, compilerOptions: { declaration: false } });
  });
  return webpack.resolveConfig();
};
