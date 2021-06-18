// const webpack = require('webpack')
// module.exports = {
//   configureWebpack: {
//     plugins: [
//       new webpack.optimize.LimitChunkCountPlugin({
//         maxChunks: 1
//       })
//     ]
//   },
//   chainWebpack:
//     config => {
//       config.optimization.delete('splitChunks')
//     }
// }

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
