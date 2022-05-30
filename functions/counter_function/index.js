'use strict';

let catalyst = require('zcatalyst-sdk-node');

let numberOfVisitors = 1;
module.exports = async (req, res) => {
	var catalystApp = catalyst.initialize(req);
	let urlObject = new URL(req.url, `http://${req.host}`);
	let path = urlObject.pathname;
	let method = req.method;
	let queryParams = urlObject.searchParams;
	let errorMessages = {
		404: 'URL not found'
	}

	if (path === '/visitors' && method === 'GET') {
		let numberOfVisitors = await getNumberOfVisitors(catalystApp);
		incrementVisitors();
		res.writeHead(200, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({
			'visitors': numberOfVisitors
		}));
		res.end();
		return;
	} else if (path === '/visitors' && method === 'PUT') {
		let secretKey = queryParams.get('secretKey');
		if (secretKey === 'sudo') {
			let newCount = queryParams.get('newCount');
			numberOfVisitors = newCount;
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({
				'visitors': numberOfVisitors
			}));
			res.end();
			return;
		}
	}

	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify({
		'status': errorMessages[404],
		'path': path,
		'method': method
	}));
	res.end();
};

function incrementVisitors() {
	numberOfVisitors++;
}


async function getNumberOfVisitors(catalystApp) {
	return new Promise((resolve, reject) => {
		let tableName = 'views';
		let columnName = 'VIEW_COUNT';
		let tempValue = '0';
		// Queries the Catalyst Data Store table
		catalystApp.zcql().executeZCQLQuery("select * from " + tableName + " where " + columnName + "='" + tempValue + "'")
			.then(queryResponse => {
				resolve(queryResponse);
			}).catch(err => {
				reject(err);
		})
	});
}

// Queries the Catalyst Data Store table and checks whether a row is present
getNumberOfVisitors(catalystApp).then(data => {
	if (data.length == 0) {
		return 0;
	} else {
		return 100;
	}
}).catch(err => {
	return null;
});