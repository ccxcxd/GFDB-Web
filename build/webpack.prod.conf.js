'use strict'
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserJSPlugin = require('terser-webpack-plugin')
const OptimizeCSSAsseetsPlugin = require('optimize-css-assets-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const PrerenderSPAPlugin = require('prerender-spa-plugin')
const Renderer = PrerenderSPAPlugin.PuppeteerRenderer

const webpackBaseConf = require('./webpack.base.conf.js')
const config = require('./config/index.js')

const {
  ROOT,
  SRC,
  OUTPUT_DIR,
  DLL_DIR,
  STATIC_DIR,

  PUBLIC_PATH,

  prod,
  dll,

  languages,
} = config

module.exports = merge(webpackBaseConf, (() => {
  const configObj = {
    mode: 'production',
    // mode: 'development',
  
    output: {
      path: OUTPUT_DIR,
      publicPath: PUBLIC_PATH,
      filename: '[name]/index.[contenthash].js',
      chunkFilename: 'chunks/[id].[contenthash].js',
    },

    module: {
      rules: [
        {
          test: /\.(le|c)ss$/,
          include: path.resolve(ROOT, './node_modules'),
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: true,
              },
            },
            'css-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(le|c)ss$/,
          include: SRC,
          use: [
            // {
            //   loader: 'style-loader',
            // },
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                context: SRC,
                localIdentName: '[local]___[hash:base64:6]',
                camelCase: true,
              },
            },
            {
              loader: 'less-loader',
            },
            {
              loader: 'style-resources-loader',
              options: {
                patterns: path.resolve(SRC, './utils/less/variables/*.less'),
                injector: 'append'
              },
            },
          ],
        },
      ],
    },
  
    resolve: {
      alias: {
        ...prod.aliasExtra,
      },
    },
  
    optimization: {
      minimizer: [
        new TerserJSPlugin(),
        new OptimizeCSSAsseetsPlugin(),
      ],
      splitChunks: {
        cacheGroups: {
          commons: {
            name: 'commons',
            filename: 'static/commons/[name].[contenthash].js',
            chunks: 'initial',
            minChunks: 2,
          },
        },
      },
    },
  
    plugins: [
      // css extract
      new MiniCssExtractPlugin({
        filename: 'styles.[contenthash].css',
        chunkFilename: '[id].[contenthash].css',
      }),
      // 配置 dll
      new webpack.DllReferencePlugin({
        context: STATIC_DIR,
        manifest: path.resolve(DLL_DIR, `./${dll.name}-manifest.json`),
        name: dll.name,
      }),
      // prerender setting
      ...languages.map((la) => {
        const laName = la.name
        return new PrerenderSPAPlugin({
          staticDir: OUTPUT_DIR,
          routes: [
            `/${laName}/`,
            `/${laName}/maps`,
            `/${laName}/quest`,
          ],
          indexPath: path.resolve(OUTPUT_DIR, `./${laName}/index.html`),
          renderer: new Renderer({
            renderAfterDocumentEvent: 'dva-init',
            // headless: false,
          }),
        })
      }),
    ],
  }

  if (prod.ifAnalyze) {
    // 包体积分析插件
    configObj.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
      })
    )
  }

  return configObj
})())
