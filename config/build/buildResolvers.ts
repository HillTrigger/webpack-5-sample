import webpack from 'webpack';
import { BuildOptions } from './types/types';

export function buildResolvers(
  options: BuildOptions
): webpack.Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': options.paths.src,
      '@img': options.paths.src + '/img',
      '@sections': options.paths.src + '/modules/sections',
      '@scss': options.paths.src + '/scss',
      '@modules': options.paths.src + '/js/modules',
      '@components': options.paths.src + '/js/components',
      '@helpers': options.paths.src + '/js/helpers',
      '@utils': options.paths.src + '/js/utils',
    },
  };
}
