
function getTableDefinition(dbSchema, tableName) {
	var mysql = require("mysql");

	var connection = mysql.createConnection({
		host: 'localhost',
		port: '8889',
		user: 'root',
		password: 'root',
		database: 'modelizor_test'
	});

	connection.query(
			'select * ' +
			'From '+
				'INFORMATION_SCHEMA.COLUMNS As C Left Join '+
				'INFORMATION_SCHEMA.TABLE_CONSTRAINTS As TC '+
			'On '+
				'TC.TABLE_SCHEMA = C.TABLE_SCHEMA And '+
				'TC.TABLE_NAME = C.TABLE_NAME And '+
				'TC.CONSTRAINT_TYPE = \'PRIMARY KEY\' '+
			'Where '+
				'C.TABLE_NAME = \'' + tableName +'\' and '+
				'C.TABLE_SCHEMA = \'' + dbSchema +'\'',
			function(error, rows, fields) {
		console.log(rows);
	});
}

exports.getTableDefinition = getTableDefinition;