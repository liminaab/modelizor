let drivers = require('./src/drivers.js');
let fileCreator = require('./src/file_creator.js');

const confs = [{
    driver: drivers.postgres,
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'queue',
    schema: 'public',
    target: 'go',
    tables: ['jobs']
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
        let callback = function(result) {
            fileCreator.createFile(conf.target, result);
        };
        let dbConnection = require('./src/db_connectors/pg.js').connect(conf);
        dbConnection.getTableDefinition(conf.schema, table, callback);
    })

})