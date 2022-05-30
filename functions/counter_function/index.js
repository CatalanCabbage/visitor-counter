'use strict';

let numberOfVisitors = 1;
module.exports = (req, res) => {
	var url = req.url;
	let errorMessages = {
		404 : 'URL not found'
	}

	if (url === '/visitors' && req.method === 'GET') {
		incrementVisitors();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({
			'visitors' : numberOfVisitors
		}));
		res.end();
		return;
	} else if (url === '/visitors' && req.method === 'PUT') {
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
	res.write( JSON.stringify({ 'status' : errorMessages[404], 'url' : url, 'method' : url.method }));
	res.end();
};

function incrementVisitors() {
	numberOfVisitors++;
}