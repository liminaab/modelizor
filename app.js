#!/usr/bin/env node

let fs = require('fs')
let drivers = require('./src/drivers.js');
let fileCreator = require('./src/file_creator.js');
let queries = require('./src/helpers/queries.js');

let Q = require('q')


let confFilePath = process.argv[2];
let pathArr = confFilePath.split("/");
pathArr.pop();
let confpath = pathArr.join("/");
let cwd = process.cwd();
path = cwd + "/" + confpath

let confFile = fs.readFileSync(confFilePath, "utf8")
let confs = JSON.parse(confFile)

confs.forEach((conf) => {
    let i = 0;
    let tableCount = conf.tables.length;
    conf.tables.forEach((table) => {

        let dbConnection = require('./src/db_connectors/' + conf.driver + '.js').connect(conf);

        let relevantConf = {
            target: conf.target,
            table: table,
            fk_prefix: conf.fk_prefix,
            driver: conf.driver,
            schema: conf.schema,
            dbGetter: conf.dbGetter,
            imports: conf.imports,
            outputdir: path + "/" + conf.outputdir
        }

        let rows = dbConnection.execute(queries.getTableDefinitionQuery(relevantConf))
        let relationsTo = dbConnection.execute(queries.getRelationsToTable(relevantConf))
        let many2Many = dbConnection.execute(queries.getMany2Many(relevantConf))

        Q.allSettled([rows, relationsTo, many2Many]).then((results) => {

            columns = results[0];
            hasMany = results[1];
            many2Many = results[2];

            rows = {
                ownColumns: columns.value,
                hasMany: hasMany.value,
                many2Many: many2Many.value,
            }
            fileCreator.createFile(relevantConf, rows);

        }).catch((err) => {
            console.log(err)
        }).finally(() => {
            dbConnection.close();
        })
    })

})