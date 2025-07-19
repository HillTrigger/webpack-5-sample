import webpack from 'webpack';

import { buildWebpack } from './config/build/buildWebpack';
import { BuildMode, BuildPaths } from './config/build/types/types';
import path from 'path';

interface EnvVariables {
  mode: BuildMode;
  port: number;
  min: boolean;
  analyzer?: boolean;
}

export default (rawEnv: Record<string, unknown>) => {
  const env: EnvVariables = {
    mode: rawEnv.mode === 'production' ? 'production' : 'development',
    port: Number(rawEnv.port) || 3000,
    min: rawEnv.min !== 'false',
		analyzer: rawEnv.analyzer === 'true' || rawEnv.analyzer === true,
  };

  const paths: BuildPaths = {
    entry: [
      path.resolve(__dirname, 'src', 'index.js'),
      path.resolve(__dirname, 'src', 'test.js'),
    ],
    output: path.resolve(__dirname, 'dist'),
    html: path.resolve(__dirname, 'src', 'views'),
  };

  const config: webpack.Configuration = buildWebpack({
    port: env.port ?? 3000,
    mode: env.mode ?? 'development',
    min: rawEnv.min !== 'false',
    paths,
		analyzer: env.analyzer
  });

  return config;
};
