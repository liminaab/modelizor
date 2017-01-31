var mysql = require("mysql");
var queries = require('../helpers/queries.js');
let drivers = require('../drivers.js');

var connection = null;

function connect(config) {
    connection = mysql.createConnection(config);
    return this;
}

function getTableDefinition(dbSchema, tableName, callback) {
    connection.query(
        queries.getTableDefinitionQuery(dbSchema, tableName, "mysql"),
        function(error, rows, fields) {
            if (error) {
                throw Error("DB error trying to get table definition in " + __filename)
            }
            rows = convertToStandardFormat(result.rows)

            callback(rows);
        });
}

function convertToStandardFormat(rows) {
    return rows.map((row) => {
        return {
            "TABLE_NAME": row["TABLE_NAME"],
            "COLUMN_NAME": row["COLUMN_NAME"],
            "COLUMN_DEFAULT": row["COLUMN_DEFAULT"],
            "IS_NULLABLE": row["IS_NULLABLE"],
            "DATA_TYPE": row["DATA_TYPE"],
            "CONSTRAINT_NAME": row["CONSTRAINT_NAME"],
            "REFERENCED_TABLE_SCHEMA": row["REFERENCED_TABLE_SCHEMA"],
            "REFERENCED_TABLE_NAME": row["REFERENCED_TABLE_NAME"],
            "REFERENCED_COLUMN_NAME": row["REFERENCED_COLUMN_NAME"],
        }
    })

}

exports.connect = connect;
exports.getTableDefinition = getTableDefinition;