var mysql = require("mysql");
var queries = require('../helpers/queries.js');
var connection = null;

function connect(config) {
	connection = mysql.createConnection(config);
	return this;
}

function getTableDefinition(dbSchema, tableName, callback) {
	connection.query(
			queries.getTableDefinitionQuery(dbSchema, tableName),
			function(error, rows, fields) {
		callback(rows);
	});
}

exports.connect = connect;
exports.getTableDefinition = getTableDefinition;