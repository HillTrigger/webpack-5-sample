const path = require('path');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router(path.resolve(__dirname, './db.json'));

server.use(jsonServer.bodyParser);

const color = {
	reset: '\x1b[0m',
	dim: '\x1b[2m',
	cyan: '\x1b[36m',
	green: '\x1b[32m',
	yellow: '\x1b[33m',
	red: '\x1b[31m',
	magenta: '\x1b[35m',
};

function colorStatus(status) {
	if (status >= 500) return `${color.red}${status}${color.reset}`;
	if (status >= 400) return `${color.yellow}${status}${color.reset}`;
	if (status >= 300) return `${color.magenta}${status}${color.reset}`;
	if (status >= 200) return `${color.green}${status}${color.reset}`;
	return `${color.cyan}${status}${color.reset}`;
}

function colorMethod(method) {
	switch (method) {
		case 'GET':
			return `${color.cyan}${method}${color.reset}`;
		case 'POST':
			return `${color.green}${method}${color.reset}`;
		case 'PUT':
		case 'PATCH':
			return `${color.yellow}${method}${color.reset}`;
		case 'DELETE':
			return `${color.red}${method}${color.reset}`;
		default:
			return method;
	}
}

server.use((req, res, next) => {
	const startedAt = process.hrtime.bigint();

	res.header('X-Mock-Server', 'json-server');

	res.on('finish', () => {
		const diffNs = process.hrtime.bigint() - startedAt;
		const ms = Number(diffNs) / 1e6;
		const length = res.getHeader('content-length') ?? '-';

		console.log(
			`${colorMethod(req.method)} ${req.originalUrl} ${colorStatus(res.statusCode)} ${color.dim}${ms.toFixed(3)} ms - ${length}${color.reset}`,
		);
	});

	setTimeout(next, 300);
});

server.use(
	jsonServer.rewriter({
		'/api/*': '/$1',
	}),
);

server.use(router);

server.listen(3001);
