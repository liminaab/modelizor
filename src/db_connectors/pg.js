var pg = require("pg");
var queries = require('../helpers/queries.js');
var connection = null;

function connect(config) {
	connection = new pg.Client(config);
	connection.connect(function(err, client, done) {});
	return this;
}

function getTableDefinition(dbSchema, tableName, callback) {
	connection.query(
			queries.getTableDefinitionQuery(dbSchema, tableName),
			function(error, result) {
		callback(result.rows);
	});
}

exports.connect = connect;
exports.getTableDefinition = getTableDefinition;