var pg = require("pg");
var Q = require("q");
var queries = require('../helpers/queries.js');
let drivers = require('../drivers.js');

var db = {
    connection: null,
    close: function close() {
        this.connection.end(function(err) {
            if (err) throw err;
        });
    },
    connect: function connect(config) {
        this.connection = new pg.Client(config);
        this.connection.connect(function(err, client, done) {});
        return this;
    },

    execute: function execute(query) {
        let p = Q.defer();
        this.connection.query(
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

function connect(conf) {
    var conn = Object.assign({}, db);
    conn.connect(conf);
    return conn;

}
exports.connect = connect