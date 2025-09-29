module.exports = {
  publicPath: '',
  outputDir: 'dist',
  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false
    },
    cordovaPath: 'cordova'
  },
  transpileDependencies: [
    'quasar',
    /ckeditor5-[^/]+/
  ],

  // devServer: {
  //   proxy: 'https://localhost:8080'
  // }
}
