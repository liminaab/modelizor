#!/usr/bin/env node

let fs = require('fs')
let drivers = require('./src/drivers.js');
let fileCreator = require('./src/file_creator.js');
let queries = require('./src/helpers/queries.js');
let config = require('./src/conf');
let Q = require('q')

let argument = process.argv[2];

if (argument === undefined || argument === "help" || argument === "-h" || argument === "--help") {
    displayHelp()
    return
}
if (argument == "init") {
    spitOutDefaultConf()
    return
}

let confs = config.get(argument)

confs.forEach((conf) => {
    config.setDefaultValues(conf)
    config.validate(conf)

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
            outputdir: conf.outputdir,
            models_import_path: conf.models_import_path
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

function spitOutDefaultConf() {
    let filename = "modelizor_template_" + Date.now() + ".conf"
    let content = `[{
    "driver": "pg",
    "host": "localhost",
    "user": "postgres",
    "password": "p4ssw0rd",
    "database": "mydb",
    "schema": "public",
    "fk_prefix": "fk_",
    "target": "go",
    "dbGetter": "app.DB",
    "imports": ["project/app"],
    "tables": ["users", "products", "orders"],
    "models_import_path":"com.limina.www",
}`
    fs.writeFileSync(filename, content, "utf8", "w");
}

function displayHelp() {
    console.log(`
    modelizor help              - this help message
    modelizor init              - creates a standard conf file for you to fill in
    modelizor pathToConffile    - creates models accordiing to conf
    `)
}