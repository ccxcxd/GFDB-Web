module.exports = (conf) => {
  const {
    HOST,
    PORT,
    languages,
  } = conf

  const rules = languages.map(d => {
    return {
      from: `^\/${d.name}`,
      to: `/${d.name}/`,
    }
  })

  return {
    contentBase: './dist',
    publicPath: '/',
    // 设置localhost端口
    host: HOST,
    port: PORT,
    disableHostCheck: true,
    // 自动打开浏览器
    // open: true,
    hot: true,
    quiet: true,
    historyApiFallback: {
      rewrites: [
        ...rules,
      ],
    },
  }
}