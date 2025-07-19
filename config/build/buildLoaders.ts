const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import webpack from 'webpack';
import { BuildOptions } from './types/types';
import path from 'path';

export function buildLoaders(
  options: BuildOptions
): webpack.ModuleOptions['rules'] {
  const isDev = options.mode === 'development';
  const threadLoader = {
    loader: 'thread-loader', // позволяет выполнять обработку файлов (TypeScript, Babel, Sass и др.) в отдельных потоках (worker'ах), используя возможности многоядерных процессоров.
    options: {
      workers: require('os').cpus().length - 1, // Автоматически по числу ядер
      workerParallelJobs: 50,
      poolTimeout: 2000,
    },
  };

  const cssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      // threadLoader, // малоэффективен
      'sass-loader',
    ],
  };
  const tsLoader = {
    test: /\.tsx?$/,
    use: [
      threadLoader,
      {
        loader: 'ts-loader', // с помощью new ForkTsCheckerWebpackPlugin() - проверку типов можно делать отдельным процессом(если работаете с ts)
        options: {
          transpileOnly: true, // Ускоряет сборку, но отключает проверку типов
          happyPackMode: true, // Обязательно для работы с thread-loader!
        },
      },
    ],
    exclude: /node_modules/,
  };
  const pugLoader = {
    test: /\.pug$/,
    use: {
      loader: '@webdiscus/pug-loader',
      options: {
        mode: 'compile',
        esModule: true, // для использования import
				// basedir: path.resolve(options.paths.src),
				// prependData: `include /partials/index.pug`
        // pretty: isDev,
        // compileDebug: isDev,
        // можно добавить embedFilters и другие опции
      },
    },
  };
  const assetLoader = {
    test: /\.(png|jpe?g|gif|svg|webp)$/i,
    type: 'asset/resource',
    generator: {
      filename: 'images/[name][ext]',
    },
  };
  const spriteLoader = {
    test: /\.svg$/,
    include: path.resolve(options.paths.src, 'svg'), // <--- только /svg/
    use: [
      {
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'svg/sprite.svg', // <--- сюда будет собираться спрайт
        },
      },
      'svgo-loader', // опционально, для оптимизации SVG
    ],
  };
  const svgLoader = {
    test: /\.svg$/i,
    type: 'asset/resource',
    generator: {
      filename: 'images/svg/[name][ext]',
    },
    include: [options.paths.src + 'img/svg/'],
  };

  return [cssLoader, tsLoader, pugLoader, assetLoader, svgLoader, spriteLoader];
}
