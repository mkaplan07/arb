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
  configureWebpack: {
    optimization: {
      splitChunks: false
    }
  }
}

module.exports = {
  css: {
    extract: false,
  },
}
