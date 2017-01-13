function getTableDefinitionQuery(dbSchema, tableName) {
	return 'select ' + 
				'C.TABLE_NAME, ' +
				'C.COLUMN_NAME, ' +
				'C.COLUMN_DEFAULT, ' +
				'C.IS_NULLABLE, ' +
				'C.DATA_TYPE, ' +
				'KCU.CONSTRAINT_NAME, ' +
				'KCU.REFERENCED_TABLE_SCHEMA, ' +
				'KCU.REFERENCED_TABLE_NAME, ' +
				'KCU.REFERENCED_COLUMN_NAME ' +
				
			'From '+
				'INFORMATION_SCHEMA.COLUMNS As C Left Join '+
				'INFORMATION_SCHEMA.KEY_COLUMN_USAGE As KCU '+
			'On '+
				'C.TABLE_NAME = KCU.TABLE_NAME And '+
				'C.TABLE_SCHEMA = KCU.TABLE_SCHEMA And '+
				'C.COLUMN_NAME = KCU.COLUMN_NAME  '+
			'Where '+
				'C.TABLE_NAME = \'' + tableName +'\' and '+
				'C.TABLE_SCHEMA = \'' + dbSchema +'\'';
}

exports.getTableDefinitionQuery = getTableDefinitionQuery;
