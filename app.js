var dbSettings = {
	host:'localhost',
	port:'8889',
	user:'root',
	password:'root',
	database:'modelizor_test'
};
var fileTemplateFolder = 'java';

/*
var callback =  function(result) {
	console.log(result);
};
var dbConnection = require('./src/db_connectors/mysql.js').connect(dbSettings);
dbConnection.getTableDefinition('modelizor_test', 'pets', callback);
*/


var generatorModel = require('./file_templates/' + fileTemplateFolder + '/model.js');
console.log(generatorModel.getBody());