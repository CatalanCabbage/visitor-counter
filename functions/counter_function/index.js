'use strict';

let catalyst = require('zcatalyst-sdk-node');

/*
 * TODO: 
 * Error handling, logging
 */
module.exports = async (req, res) => {
	let catalystApp = catalyst.initialize(req);

	//Extract required URL data
	let urlObject = new URL(req.url, `http://${req.host}`);
	let path = urlObject.pathname;
	let method = req.method;
	let queryParams = urlObject.searchParams;

	let errorMessages = {
		404: 'URL not found'
	}

	/**
	 * Spec: GET /visitors
	 * 
	 * Returns the number of visitors and increments count by 1.
	 */
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
	}

	//Default response for any unknown request
	res.writeHead(404, { 'Content-Type': 'application/json' });
	res.write(JSON.stringify({
		'status': errorMessages[404],
		'path': path,
		'method': method
	}));
	res.end();
};

function incrementVisitors(catalystApp, numberOfVisitorsData) {
	let newVisitorCount = Number(numberOfVisitorsData.value) + 1;
	let updatedRowData = {
		'ROWID': numberOfVisitorsData.ROWID,
		'param_value': newVisitorCount
	};

	//Update the table with new visitors value
	let datastore = catalystApp.datastore();
	let table = datastore.table('systemParams');
	let rowPromise = table.updateRow(updatedRowData);
	rowPromise.then((row) => {
		console.log(row);
	});
}


async function getNumberOfVisitors(catalystApp) {
	return new Promise((resolve, reject) => {
		//Query the Catalyst Data Store table
		catalystApp.zcql().executeZCQLQuery("SELECT ROWID, param_key, param_value FROM systemParams WHERE param_key='numberOfViews'")
			.then(queryResponse => {
				console.log(queryResponse);
				resolve({
					'value': queryResponse[0].systemParams.param_value,
					'ROWID': queryResponse[0].systemParams.ROWID
				});
			}).catch(err => {
				reject(err);
			})
	});
}