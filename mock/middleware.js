module.exports = (req, res, next) => {
	console.log(`[MOCK API] ${req.method} ${req.url}`);
	res.header('X-Mock-Server', 'json-server');

	setTimeout(() => {
		next();
	}, 300);
};
