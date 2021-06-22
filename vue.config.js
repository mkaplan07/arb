// https://github.com/karol-f/vue-custom-element#shadowdom-example
// https://gist.github.com/snirp/ce6b46d7b873499bfe90dfb731260334
function enableShadowCss(config) {
  const configs = [
    config.module.rule('vue').use('vue-loader'),
    config.module.rule('css').oneOf('vue-modules').use('vue-style-loader'),
    config.module.rule('css').oneOf('vue').use('vue-style-loader'),
    config.module.rule('css').oneOf('normal-modules').use('vue-style-loader'),
    config.module.rule('css').oneOf('normal').use('vue-style-loader')
  ];
  configs.forEach(c => c.tap(options => {
    options.shadowMode = true;
    return options;
  }));
}

// https://stackoverflow.com/questions/52427000/vue-js-build-and-deploy-to-single-file
module.exports = {
  css: {
    sourceMap: true,
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
  chainWebpack: (config) => {
      enableShadowCss(config);
  }
};
