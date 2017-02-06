var pg = require("pg");
var Q = require("q");
var queries = require('../helpers/queries.js');
let drivers = require('../drivers.js');

var connection = null;

function connect(config) {
    connection = new pg.Client(config);
    connection.connect(function(err, client, done) {});
    return this;
}

function execute(query) {
    let p = Q.defer();
    connection.query(
        query,
        function(error, result) {
            if (error) {
                p.reject(error);
                console.error(error)
                return;
            }
            rows = convertToStandardFormat(result.rows);
            p.resolve(rows);
        }
    )
    return p.promise;
}

function convertToStandardFormat(rows) {
    return rows.map((row) => {
        let obj = {};
        Object.keys(row).forEach((key) => {
            upper = key.toUpperCase();
            obj[upper] = row[key];
        })
        return obj
    })
}

exports.connect = connect;
exports.execute = execute;
exports.getTableDefinition = getTableDefinition;
exports.getRelationsToTable = getRelationsToTable;
exports.getMany2Many = getMany2Many;