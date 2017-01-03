var mysql = require("mysql");
var connection = null;

function connect() {
	connection = mysql.createConnection({
		host: 'localhost',
		port: '8889',
		user: 'root',
		password: 'root',
		database: 'modelizor_test'
	});
	return this;
}

function getTableDefinition(dbSchema, tableName) {
	connection.query(
			'select * ' +
			'From '+
				'INFORMATION_SCHEMA.COLUMNS As C '+
			'Where '+
				'C.TABLE_NAME = \'' + tableName +'\' and '+
				'C.TABLE_SCHEMA = \'' + dbSchema +'\'',
			function(error, rows, fields) {
		console.log(rows);
	});

	connection.query(
			'select * ' +
			'From '+
				'INFORMATION_SCHEMA.KEY_COLUMN_USAGE As TC '+
			'Where '+
				'TC.TABLE_NAME = \'' + tableName +'\' and '+
				'TC.TABLE_SCHEMA = \'' + dbSchema +'\'',
			function(error, rows, fields) {
		console.log(rows);
	});
}

exports.connect = connect;
exports.getTableDefinition = getTableDefinition;