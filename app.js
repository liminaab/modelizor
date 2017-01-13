var dbSettings = {
	host:'localhost',
	port:'8889',
	user:'root',
	password:'root',
	database:'modelizor_test'
};
var fileTemplateFolder = 'java';
javaPackage = 'com.limina.module1';

var callback =  function(result) {
	var fileCreator = require('./src/file_creator.js');
	fileCreator.createFile(fileTemplateFolder, result);
};
var dbConnection = require('./src/db_connectors/mysql.js').connect(dbSettings);
dbConnection.getTableDefinition('modelizor_test', 'pets', callback);

