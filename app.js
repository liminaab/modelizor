var dbConnection = require('./src/db_connectors/mysql.js');

dbConnection.getTableDefinition('modelizor_test', 'pets');