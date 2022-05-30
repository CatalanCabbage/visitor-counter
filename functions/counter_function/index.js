'use strict';

let numberOfVisitors = 1;
module.exports = (req, res) => {
	let urlObject = new URL(req.url, `http://${req.host}`);
	let path = urlObject.pathname;
	let method = req.method;
	let errorMessages = {
		404 : 'URL not found'
	}

	if (path === '/visitors' && method === 'GET') {
		incrementVisitors();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({
			'visitors' : numberOfVisitors
		}));
		res.end();
		return;
	} else if (path === '/visitors' && method === 'PUT') {
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
	res.write( JSON.stringify({ 
		'status' : errorMessages[404], 
		'path' : path, 
		'method' : method		
	}));
	res.end();
};

function incrementVisitors() {
	numberOfVisitors++;
}