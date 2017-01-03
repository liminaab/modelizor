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
				'INFORMATION_SCHEMA.COLUMNS As C Left Join '+
				'INFORMATION_SCHEMA.KEY_COLUMN_USAGE As KCU '+
			'On '+
				'C.TABLE_NAME = KCU.TABLE_NAME And '+
				'C.TABLE_SCHEMA = KCU.TABLE_SCHEMA And '+
				'C.COLUMN_NAME = KCU.COLUMN_NAME  '+
			'Where '+
				'C.TABLE_NAME = \'' + tableName +'\' and '+
				'C.TABLE_SCHEMA = \'' + dbSchema +'\'',
			function(error, rows, fields) {
		console.log(rows);
	});
}

exports.connect = connect;
exports.getTableDefinition = getTableDefinition;