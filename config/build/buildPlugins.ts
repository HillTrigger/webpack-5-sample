import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { BuildOptions } from './types/types';
import { globSync } from 'fs';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export function buildPlugins({
  mode,
  paths,
  analyzer,
}: BuildOptions): webpack.Configuration['plugins'] {
  const isDev = mode === 'development';
  const isProd = mode === 'production';
  const pugFiles = globSync(path.join(paths.html, '**/*.pug'));

  const plugins: webpack.Configuration['plugins'] = [
    // HTML
    ...pugFiles.map((html: string) => {
      const filename = path.basename(html).replace(/\.[^.]+$/, '');
      const templateParameters = (() => {
        switch (filename) {
          case 'sitemap':
            return {
              sitemap: pugFiles.map((p) => `${path.basename(p, '.pug')}`),
              title: filename,
              lang: 'en',
            };

          default:
            return {
              title: filename,
              lang: 'en',
            };
        }
      })();
      // views.push(filename);
      return new HtmlWebpackPlugin({
        filename: `${filename}.html`,
        template: html,
        templateParameters,
        // chunks: ['bundle', filename],
        minify: false, // Отключаем минификацию
      });
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }), // Нужен для добавления css в отдельные файлы
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()); // Значительно влияет на время сборки
  }
  if (isProd) {
    // plugins.push(new Plugin());
  }
  if (analyzer) {
    plugins.push(new BundleAnalyzerPlugin());
  }
  return plugins;
}

// Функция для получения имён файлов во views
