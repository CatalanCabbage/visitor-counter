'use strict';

module.exports = (req, res) => {
	var url = req.url;
	let errorMessages = {
		404 : 'URL not found'
	}
	let numberOfVisitors = 1;

	res.writeHead(200, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify({
		'url' : url,
		'mode' : req.mode || 'no mode',
		'method' : req.method
	}));
	res.end();
	return;

	if (url === '/visitors' && req.mode === 'GET') {
		incrementVisitors();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({
			'visitors' : numberOfVisitors
		}));
		res.end();
		return;
	} else if (url === '/visitors' && req.mode === 'PUT') {
		let secretKey = req.query.secretKey;
		if (secretKey === 'sudo') {
			let newCount = req.query.newCount;
			numberOfVisitors = newCount;
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({
				'visitors' : numberOfVisitors
			}));
			res.end();
			return;
		}
	}
	
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.write( JSON.stringify({ 'status' : errorMessages[404]}) );
	res.end();
};

function incrementVisitors() {
	numberOfVisitors++;
}