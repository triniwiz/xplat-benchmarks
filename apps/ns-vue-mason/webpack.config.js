const webpack = require('@nativescript/webpack');
const { benchDefines } = require('../ns-common/webpack-versions.cjs');

module.exports = (env) => {
  webpack.init(env);
  webpack.useConfig('vue');
  webpack.chainWebpack((config) => {
    config.plugin('DefinePlugin').tap((args) => {
      Object.assign(args[0], benchDefines(__dirname));
      return args;
    });
  });
  return webpack.resolveConfig();
};
