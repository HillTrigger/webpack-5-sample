import webpack from 'webpack';

type BuildReportPluginOptions = {
	appUrl: string;
	apiUrl: string;
};

export class BuildReportPlugin {
	private frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
	private timer?: NodeJS.Timeout;
	private frameIndex = 0;
	private text = 'Сборка...';
	private options: BuildReportPluginOptions;
	private hasBuiltOnce = false;

	private readonly brandBanner = [
		'██╗  ██╗██╗██╗     ██╗     ████████╗██████╗ ██╗ ██████╗  ██████╗ ███████╗██████╗',
		'██║  ██║██║██║     ██║     ╚══██╔══╝██╔══██╗██║██╔════╝ ██╔════╝ ██╔════╝██╔══██╗',
		'███████║██║██║     ██║        ██║   ██████╔╝██║██║  ███╗██║  ███╗█████╗  ██████╔╝',
		'██╔══██║██║██║     ██║        ██║   ██╔══██╗██║██║   ██║██║   ██║██╔══╝  ██╔══██╗',
		'██║  ██║██║███████╗███████╗   ██║   ██║  ██║██║╚██████╔╝╚██████╔╝███████╗██║  ██║',
		'╚═╝  ╚═╝╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝ ╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝',
		'github.com/HillTrigger',
	];

	constructor(options: BuildReportPluginOptions) {
		this.options = options;
	}

	private formatBytes(bytes: number): string {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KiB`;
		return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
	}

	private getBuildTimeMs(stats: webpack.Stats): number {
		return typeof stats.startTime === 'number' &&
			typeof stats.endTime === 'number'
			? stats.endTime - stats.startTime
			: 0;
	}

	private render() {
		const frame = this.frames[this.frameIndex++ % this.frames.length];
		process.stdout.write(`\r${frame} ${this.text}`);
	}

	private start(text = 'Сборка...') {
		this.stopSilently();
		this.text = text;
		this.frameIndex = 0;
		this.render();
		this.timer = setInterval(() => this.render(), 80);
	}

	private clearLine() {
		process.stdout.write('\r\x1b[K');
	}

	private stopSilently() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
	}

	private printSummary(stats: webpack.Stats) {
		const json = stats.toJson({
			all: false,
			assets: true,
			entrypoints: true,
			errors: false,
			warnings: false,
		});

		const buildTimeMs = this.getBuildTimeMs(stats);

		const entrypointLines = Object.entries(json.entrypoints || {}).map(
			([name, entrypoint]) => {
				const assets = entrypoint.assets || [];
				const totalSize = assets.reduce(
					(sum, asset) => sum + (asset.size || 0),
					0,
				);

				return `  • ${name}: ${this.formatBytes(totalSize)}`;
			},
		);

		this.clearLine();

		const lines = [
			'',
			...this.brandBanner,
			'',
			`✅ Build ready in ${buildTimeMs} ms`,
			'📦 Бандлы:',
			...entrypointLines,
			`🌐 App: ${this.options.appUrl}`,
			`🧪 API: ${this.options.apiUrl}`,
			'',
		];

		process.stdout.write(lines.join('\n'));
	}

	private printRebuild(stats: webpack.Stats) {
		const buildTimeMs = this.getBuildTimeMs(stats);
		this.clearLine();
		process.stdout.write(`✅ Rebuild ${buildTimeMs} ms\n`);
	}

	apply(compiler: webpack.Compiler) {
		compiler.hooks.run.tap('BuildReportPlugin', () => {
			this.start('Первая сборка...');
		});

		compiler.hooks.watchRun.tap('BuildReportPlugin', () => {
			this.start(this.hasBuiltOnce ? 'Пересборка...' : 'Первая сборка...');
		});

		compiler.hooks.invalid.tap('BuildReportPlugin', () => {
			this.start('Пересборка...');
		});

		compiler.hooks.done.tap('BuildReportPlugin', (stats) => {
			this.stopSilently();

			if (stats.hasErrors()) {
				this.clearLine();
				process.stdout.write('❌ Сборка завершилась с ошибками\n');
				return;
			}

			if (!this.hasBuiltOnce) {
				this.printSummary(stats);
				this.hasBuiltOnce = true;
				return;
			}

			this.printRebuild(stats);
		});

		compiler.hooks.failed.tap('BuildReportPlugin', (error) => {
			this.stopSilently();
			this.clearLine();
			process.stdout.write(`❌ Ошибка сборки: ${error.message}\n`);
		});

		compiler.hooks.watchClose.tap('BuildReportPlugin', () => {
			this.stopSilently();
			this.clearLine();
		});
	}
}
