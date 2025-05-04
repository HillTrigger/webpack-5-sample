const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import webpack from 'webpack';
import { BuildOptions } from './types/types';

export function buildLoaders(
  options: BuildOptions
): webpack.ModuleOptions['rules'] {
  const isDev = options.mode === 'development';

  const cssLoader = {
    test: /\.css$/i,
    use: [MiniCssExtractPlugin.loader, 'css-loader'],
  };
  const tsLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  };

  return [cssLoader, tsLoader];
}
