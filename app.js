let drivers = require('./src/drivers.js');
let fileCreator = require('./src/file_creator.js');
let Q = require('q')
const confs = [{
    driver: drivers.postgres,
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'queue',
    schema: 'public',
    target: 'go',
    tables: ['bills', 'dogs', 'products', 'puppies', 'houses'],
    fk_prefix: "fk_"
}];


// var fileTemplateFolder = 'java';
// javaPackage = 'com.limina.module1';

// var callback =  function(result) {
// 	var fileCreator = require('./src/file_creator.js');
// 	fileCreator.createFile(fileTemplateFolder, result);
// };
// var dbConnection = require('./src/db_connectors/mysql.js').connect(dbSettings);
// dbConnection.getTableDefinition('modelizor_test', 'pets', callback);

confs.forEach((conf) => {
    conf.tables.forEach((table) => {

        let dbConnection = require('./src/db_connectors/pg.js').connect(conf);

        let relevantConf = {
            target: conf.target,
            table: table,
            fk_prefix: conf.fk_prefix,
            driver: conf.driver,
            schema: conf.schema,
        }

        let rows = dbConnection.getTableDefinition(relevantConf);
        let relationsTo = dbConnection.getRelationsToTable(relevantConf);
        let many2Many = dbConnection.getMany2Many(relevantConf);
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
        })
    })

})