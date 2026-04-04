import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import webpack from 'webpack';
import { BuildOptions } from './types/types';
import { globSync } from 'fs';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
import { BuildReportPlugin } from '../plugins/BuildReportPlugin';
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin';

export function buildPlugins({
	mode,
	paths,
	analyzer,
	publicPath,
	dirName,
	css,
	isDevServer,
}: BuildOptions): webpack.Configuration['plugins'] {
	const isDev = mode === 'development';
	const isProd = mode === 'production';
	const pugFiles = globSync(path.join(paths.html, '**/*.pug'));
	const modalFiles = globSync(path.resolve(paths.modals, '**/*.pug'));

	const plugins: webpack.Configuration['plugins'] = [
		// HTML
		...pugFiles.map((html: string) => {
			const filename = path.basename(html).replace(/\.[^.]+$/, '');
			const templateParameters = (() => {
				switch (filename) {
					case 'modals':
						return {
							modals: modalFiles.map((p) => path.basename(p, '.pug')),
							title: filename,
							lang: 'en',
							publicPath: publicPath,
						};
					case 'sitemap':
						return {
							sitemap: pugFiles.map((p) => `${path.basename(p, '.pug')}`),
							title: filename,
							lang: 'en',
							publicPath: publicPath,
						};

					default:
						return {
							title: filename,
							lang: 'en',
							publicPath: publicPath,
						};
				}
			})();
			// views.push(filename);
			return new HtmlWebpackPlugin({
				filename: `${filename}.html`,
				template: html,
				templateParameters,
				chunks: ['_head', 'bundle', filename],
				minify: false, // Отключаем минификацию
			});
		}),
		// new SpriteLoaderPlugin({ plainSprite: true }),
		new SVGSpritemapPlugin('src/svg/**/*.svg', {
			output: {
				filename: 'svg/sprite.svg', // куда положить готовый спрайт
				svg: {
					sizes: false, // не включаем размеры, обычно удобнее
				},
			},
			sprite: {
				prefix: '',
				generate: {
					symbol: true, // используем <symbol> для <use>
					title: false, // отключаем <title> в символах
				},
			},
		}),
		new ESLintPlugin({
			extensions: ['js'],
			files: paths.src,
			emitWarning: true,
			failOnError: false,
			overrideConfigFile: '.eslintrc.js',
		}),
		new StylelintPlugin({
			files: 'src/**/*.(s?(a|c)ss)',
			emitWarning: true,
		}),
	];

	plugins.push(
		new BuildReportPlugin({
			apiUrl: 'http://localhost:3000/api/',
			appUrl: 'http://localhost:3000',
			isDevServer,
			publicPath,
		}),
	);
	if (css) {
		plugins.push(
			new MiniCssExtractPlugin({
				// Нужен для добавления css в отдельные файлы
				// filename: 'css/bundle.css',
				filename: 'css/[name].css',
				chunkFilename: '[id].css',
			}),
		);
	}
	if (isDev) {
		// plugins.push(new webpack.ProgressPlugin()); // Значительно влияет на время сборки
	}
	if (isProd) {
		plugins.push(
			new ZipPlugin({
				filename: `${dirName}.zip`,
				fileOptions: {
					mtime: new Date(),
					mode: 0o100664,
					compress: true,
					forceZip64Format: false,
				},
				zipOptions: {
					forceZip64Format: false,
				},
			}),
		);
		// plugins.push(new Plugin());
	}
	if (analyzer) {
		plugins.push(new BundleAnalyzerPlugin());
	}

	return plugins;
}
