const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import webpack from 'webpack';
import { BuildOptions } from './types/types';

export function buildLoaders(
  options: BuildOptions
): webpack.ModuleOptions['rules'] {
  const isDev = options.mode === 'development';

  const cssLoader = {
    test: /\.s[ac]ss$/i,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
  };
  const tsLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  };
  const pugLoader = {
    test: /\.pug$/,
    use: {
      loader: '@webdiscus/pug-loader',
      options: {
        mode: 'compile', // или 'compile' — выбирай по нужде
        esModule: true, // для использования import
        // можно добавить embedFilters и другие опции
      },
    },
  };

  return [cssLoader, tsLoader, pugLoader];
}
