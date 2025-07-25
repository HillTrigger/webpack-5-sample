import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import { BuildOptions } from './types/types';

export function buildDevServer(options: BuildOptions): DevServerConfiguration {
  return {
    port: options.port || 8080,
    hot: true,
    liveReload: true,
    open: true,
    compress: true,
    historyApiFallback: true,
    watchFiles: {
      paths: ['src/views/*.pug'],
      options: {
        usePolling: true,
      },
    },
    // client: {
    //   logging: 'info',
    // },
  };
}
