export interface BuildPaths {
  entry: Record<string, string>;
  html: string;
  output: string;
  src: string;
}

export type BuildMode = 'production' | 'development';

export interface BuildOptions {
  port: number;
  paths: BuildPaths;
  mode: BuildMode;
  min: boolean;
  analyzer: boolean;
  publicPath: string;
}
