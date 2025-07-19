import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { BuildOptions } from './types/types';
import { glob, globSync } from 'fs';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export function buildPlugins({
  mode,
  paths,
	analyzer
}: BuildOptions): webpack.Configuration['plugins'] {
  const isDev = mode === 'development';
  const isProd = mode === 'production';

  const plugins: webpack.Configuration['plugins'] = [
    // new HtmlWebpackPlugin({
    //   template: paths.html, // Путь к вашему шаблону
    //   // favicon: './assests/favicon.ico', //Путь к вашей иконке
    // }),
    // HTML
    ...globSync(path.join(paths.html, '**/*.html')).map((html: string) => {
      const filename = path.basename(html).replace(/\.[^.]+$/, '');
      // views.push(filename);
      return new HtmlWebpackPlugin({
        filename: `${filename}.html`,
        template: html,
        // chunks: ['bundle', filename],
        minify: false, // Отключаем минификацию
      });
    }),
    new MiniCssExtractPlugin({
			filename: 'css/[name].css'
		}), // Нужен для добавления css в отдельные файлы
  ];

  if (isDev) {
    plugins.push(new webpack.ProgressPlugin()); // Значительно влияет на время сборки
  }
  if (isProd) {
    // plugins.push(new Plugin());
  }
	if(analyzer) {
		plugins.push(new BundleAnalyzerPlugin());
	}
  return plugins;
}
