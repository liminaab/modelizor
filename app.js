var settings = {
	host:'localhost',
	port:'8889',
	user:'root',
	password:'root',
	database:'modelizor_test'
};

var callback =  function(result) {
	console.log(result);
};

var dbConnection = require('./src/db_connectors/mysql.js').connect(settings);

dbConnection.getTableDefinition('modelizor_test', 'pets', callback);

