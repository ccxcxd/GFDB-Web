const path = require('path')
const webpack = require('webpack')
const basePlus = require('../public/plugins')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = (conf) => {
  const {
    ROOT,
    HOST,
    PORT,

    notifyOnErrors,
  } = conf

  const basePlugins = basePlus(conf)

  /** 自定义的错误输出格式 */
  const createNotifierCallback = () => {
    const notifier = require('node-notifier')
    /* eslint-disable-next-line */
    const packageConfig = require(path.resolve(ROOT, 'package.json'))


    return (severity, errors) => {
      if (severity !== 'error') return

      const error = errors[0]
      const filename = error.file && error.file.split('!').pop()

      notifier.notify({
        title: packageConfig.name,
        message: severity + ': ' + error.name,
        subtitle: filename || '',
        // icon: path.join(__dirname, 'logo.png'),
      })
    }
  }

  return [
    ...basePlugins,
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    // 进度条插件
    new ProgressBarPlugin(),
    // 优化错误提示
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${HOST}:${PORT}`],
      },
      onErrors: notifyOnErrors
        ? createNotifierCallback()
        : undefined,
    }),
    // // 注册react全局引用
    // new webpack.ProvidePlugin({
    //   'React': 'react',
    //   'ReactDOM': 'react-dom',
    // }),
  ]
}