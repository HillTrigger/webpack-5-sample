import webpack from 'webpack';
import { BuildOptions } from './types/types';

export function buildResolvers(
  options: BuildOptions
): webpack.Configuration['resolve'] {
  return {
    extensions: ['.tsx', '.ts', '.js'],
  };
}
