const { defineConfig } = require('@vue/cli-service');
const path = require(`path`);
publicPath: process.env.NODE_ENV === 'production';
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'? '/nzock/': '/',

    transpileDependencies: true,

    configureWebpack: {
      resolve: {
          symlinks: false,
          alias: {
              vue: path.resolve(`./node_modules/vue`)
          }
      }
   },
   devServer: {
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        ws: true,
        changeOrigin: true
      }
    }
  },
    pluginOptions: {
      vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
    }
})
