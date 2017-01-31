var pg = require("pg");
var queries = require('../helpers/queries.js');
let drivers = require('../drivers.js');

var connection = null;

function connect(config) {
    connection = new pg.Client(config);
    connection.connect(function(err, client, done) {});
    return this;
}

function getTableDefinition(dbSchema, tableName, callback) {
    connection.query(
        queries.getTableDefinitionQuery(dbSchema, tableName, "pg"),
        function(error, result) {
            if (error) {
                throw Error("DB error trying to get table definition in " + __filename)
            }
            rows = convertToStandardFormat(result.rows)

            callback(rows);
        }
    )
}

function convertToStandardFormat(rows) {
    let stdFormat = [];
    return rows.map((row) => {
        return {
            "TABLE_NAME": row["table_name"],
            "COLUMN_NAME": row["column_name"],
            "COLUMN_DEFAULT": row["column_default"],
            "IS_NULLABLE": row["is_nullable"],
            "DATA_TYPE": row["data_type"],
            "CONSTRAINT_NAME": row["constraint_name"],
            "REFERENCED_TABLE_SCHEMA": row["referenced_table_schema"],
            "REFERENCED_TABLE_NAME": row["referenced_table_name"],
            "REFERENCED_COLUMN_NAME": row["referenced_column_name"],
        }

    })
}










exports.connect = connect;
exports.getTableDefinition = getTableDefinition;