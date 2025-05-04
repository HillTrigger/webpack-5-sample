import path from 'path';
import webpack from 'webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';

import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
type Mode = 'production' | 'development';

interface EnvVariables {
  mode: Mode;
  port: number;
}

export default (env: EnvVariables) => {
  const isDev = env.mode === 'development';

  const config: webpack.Configuration = {
    mode: env.mode,
    entry: path.resolve(__dirname, 'src', 'index.ts'),
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
      clean: true,
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, './src/views/index.html'), // Путь к вашему шаблону
        // favicon: './assests/favicon.ico', //Путь к вашей иконке
      }),
      new webpack.ProgressPlugin(), // Нужен чтобы показывать прогресс сборки !!!ВАЖНО: Значительно влияет на скорость сборки!!!
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool: isDev && 'inline-source-map',
    devServer: isDev
      ? {
          port: env.port || 3000,
          open: true,
        }
      : undefined,
  };

  return config;
};
