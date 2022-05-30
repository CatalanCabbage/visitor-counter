'use strict';

let catalyst = require('zcatalyst-sdk-node');

module.exports = async (req, res) => {
	let catalystApp = catalyst.initialize(req);
	let urlObject = new URL(req.url, `http://${req.host}`);
	let path = urlObject.pathname;
	let method = req.method;
	let queryParams = urlObject.searchParams;
	let errorMessages = {
		404: 'URL not found'
	}

	if (path === '/visitors' && method === 'GET') {
		let numberOfVisitorsData = await getNumberOfVisitors(catalystApp);
		let numberOfVisitors = numberOfVisitorsData.value;
		incrementVisitors(catalystApp, numberOfVisitorsData);
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

function incrementVisitors(catalystApp, numberOfVisitorsData) {
	console.log(numberOfVisitorsData.rowId);
	let updatedRowData = {
        'ROWID': numberOfVisitorsData.rowId,
		'param_value': (1 + Number(numberOfVisitorsData.value)) 
    };

	let datastore = catalystApp.datastore();
    let table = datastore.table('systemParams');
    let rowPromise = table.updateRow(updatedRowData);
	rowPromise.then((row) => {
		console.log(row);
	});
}


async function getNumberOfVisitors(catalystApp) {
	return new Promise((resolve, reject) => {
		let tableName = 'systemParams';
		let columnName = 'param_key';
		// Queries the Catalyst Data Store table
		catalystApp.zcql().executeZCQLQuery("SELECT ROWID, param_key, param_value FROM systemParams WHERE param_key='numberOfViews'")
			.then(queryResponse => {
				console.log(queryResponse);
				resolve({
					'value' : queryResponse[0].systemParams.param_value,
					'ROWID' : queryResponse[0].systemParams.ROWID
				});
			}).catch(err => {
				reject(err);
			})
	});
}

// // Queries the Catalyst Data Store table and checks whether a row is present
// getNumberOfVisitors(catalystApp).then(data => {
// 	if (data.length == 0) {
// 		return 0;
// 	} else {
// 		return 100;
// 	}
// }).catch(err => {
// 	return null;
// });