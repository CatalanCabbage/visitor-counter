'use strict';

let numberOfVisitors = 1;
module.exports = (req, res) => {
	let url = req.url;
	let method = req.method;
	let errorMessages = {
		404 : 'URL not found'
	}

	if (url === '/visitors' && method === 'GET') {
		incrementVisitors();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({
			'visitors' : numberOfVisitors
		}));
		res.end();
		return;
	} else if (url === '/visitors' && method === 'PUT') {
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
	res.write( JSON.stringify({ 'status' : errorMessages[404], 'url' : url, 'method' : method }));
	res.end();
};

function incrementVisitors() {
	numberOfVisitors++;
}