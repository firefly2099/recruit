module.exports = {
  publicPath: "/",

  devServer: {
    // hot: true,
    // clientLogLevel: "warning",
    overlay: {
      warnings: true,
      error: true
    },

    proxy: {
      "/public": {
        // target: "http://10.35.128.70/club",
        target: "http://join.entiresocial.com",
        changeOrigin: true,
        pathRewrite: {}
      }
    }
  },

  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html"
    }
  },

  // 生产环境 sourceMap
  // 静态文件目录
  // assetsDir: 'static',
  productionSourceMap: false,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
};
