import webpack from 'webpack';
import path from 'path';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import { buildDevServer } from './buildDevServer';
import { buildLoaders } from './buildLoaders';
import { buildPlugins } from './buildPlugins';
import { buildResolvers } from './buildResolvers';
import { BuildOptions } from './types/types';

export function buildWebpack(options: BuildOptions): webpack.Configuration {
  const { mode, paths, min, publicPath } = options;
  const isDev = mode === 'development';

  return {
    mode: mode,
    optimization: {
      runtimeChunk: isDev ? 'single' : undefined,  // обязательно для работы HMR вместе с несколькими entry
      minimize: min,
    },
    entry: paths.entry,
    output: {
      path: paths.output,
      filename: 'js/[name].js',
      publicPath,
      clean: true,
      chunkFilename: 'js/chunks/chunk_[name].js',
    },
    plugins: buildPlugins(options),
    module: {
      rules: buildLoaders(options),
    },
    resolve: buildResolvers(options),
    devtool: isDev && 'inline-source-map',
    devServer: isDev ? buildDevServer(options) : undefined,
  };
}
