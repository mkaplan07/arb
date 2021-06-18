// https://stackoverflow.com/questions/52427000/vue-js-build-and-deploy-to-single-file
module.exports = {
  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  },
}
