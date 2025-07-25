import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import { BuildOptions } from './types/types'
import { globSync } from 'fs'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
import SvgChunkWebpackPlugin from 'svg-chunk-webpack-plugin'
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin')
const ESLintPlugin = require('eslint-webpack-plugin');

export function buildPlugins({
  mode,
  paths,
  analyzer,
}: BuildOptions): webpack.Configuration['plugins'] {
  const isDev = mode === 'development'
  const isProd = mode === 'production'
  const pugFiles = globSync(path.join(paths.html, '**/*.pug'))

  const plugins: webpack.Configuration['plugins'] = [
    // HTML
    ...pugFiles.map((html: string) => {
      const filename = path.basename(html).replace(/\.[^.]+$/, '')
      const templateParameters = (() => {
        switch (filename) {
          case 'sitemap':
            return {
              sitemap: pugFiles.map(p => `${path.basename(p, '.pug')}`),
              title: filename,
              lang: 'en',
            }

          default:
            return {
              title: filename,
              lang: 'en',
            }
        }
      })()
      // views.push(filename);
      return new HtmlWebpackPlugin({
        filename: `${filename}.html`,
        template: html,
        templateParameters,
        // chunks: ['bundle', filename],
        minify: false, // Отключаем минификацию
      })
    }),
    new SpriteLoaderPlugin({ plainSprite: true }),
    new ESLintPlugin({
      extensions: ['js'],
      files: paths.src,
      emitWarning: true,
      failOnError: false,
      overrideConfigFile: '.eslintrc.js',
    }),
  ]

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()) // Значительно влияет на время сборки
  }
  if (isProd) {
    plugins.push(
      new MiniCssExtractPlugin({
        // Нужен для добавления css в отдельные файлы
        // filename: 'css/bundle.css',
        filename: 'css/[name].css',
        chunkFilename: '[id].css',
      })
    )
    // plugins.push(new Plugin());
  }
  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin())
  }
  return plugins
}
