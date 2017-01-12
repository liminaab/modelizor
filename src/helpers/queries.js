function getTableDefinitionQuery(dbSchema, tableName) {
	return 'select * ' +
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