// https://stackoverflow.com/questions/52427000/vue-js-build-and-deploy-to-single-file
// module.exports = {
//   css: {
//     extract: false,
//   },
//   configureWebpack: {
//     optimization: {
//       splitChunks: false
//     }
//   },
// }

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
  // const configs = [
  //   config.module.rule('vue').use('vue-loader'),
  // ];
  // const ruleSets = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
  // const ruleNames = ['vue-modules', 'vue', 'normal-modules', 'normal'];
  //
  // ruleSets.forEach((ruleSet) => {
  //   if (config.module.rules.store.has(ruleSet)) {
  //     ruleNames.forEach((rName) => {
  //       if (config.module.rule(ruleSet).oneOfs.store.has(rName)) {
  //         if (config.module.rule(ruleSet).oneOf(rName).uses.store.has('vue-style-loader')) {
  //           configs.push(config.module.rule(ruleSet).oneOf(rName).use('vue-style-loader'));
  //         }
  //       }
  //     });
  //   }
  // });
  // if (!process.env.BUILD_MODE) {
  //   process.env.BUILD_MODE = config.store.get('mode');
  // }
  configs.forEach((c) => c.tap((options) => {
    options.shadowMode = true;
    return options;
  }));
}

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
