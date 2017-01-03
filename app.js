var dbConnection = require('./src/db_connectors/mysql.js').connect();

dbConnection.getTableDefinition('modelizor_test', 'pets');