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

/*
  RowDataPacket {
    TABLE_CATALOG: 'def',
    TABLE_SCHEMA: 'modelizor_test',
    TABLE_NAME: 'pets',
    COLUMN_NAME: 'name',
    ORDINAL_POSITION: 3,
    COLUMN_DEFAULT: null,
    IS_NULLABLE: 'NO',
    DATA_TYPE: 'text',
    CHARACTER_MAXIMUM_LENGTH: 65535,
    CHARACTER_OCTET_LENGTH: 65535,
    NUMERIC_PRECISION: null,
    NUMERIC_SCALE: null,
    CHARACTER_SET_NAME: 'utf8',
    COLLATION_NAME: 'utf8_unicode_ci',
    COLUMN_TYPE: 'text',
    COLUMN_KEY: '',
    EXTRA: '',
    PRIVILEGES: 'select,insert,update,references',
    COLUMN_COMMENT: '' },*/

    /*
TABLE_CATALOG: 'def',
    TABLE_SCHEMA: 'modelizor_test',
    TABLE_NAME: 'pets',
    COLUMN_NAME: 'user_id',
    ORDINAL_POSITION: 1,
    COLUMN_DEFAULT: null,
    IS_NULLABLE: 'NO',
    DATA_TYPE: 'int',
    CHARACTER_MAXIMUM_LENGTH: null,
    CHARACTER_OCTET_LENGTH: null,
    NUMERIC_PRECISION: 10,
    NUMERIC_SCALE: 0,
    CHARACTER_SET_NAME: null,
    COLLATION_NAME: null,
    COLUMN_TYPE: 'int(11)',
    COLUMN_KEY: 'MUL',
    EXTRA: '',
    PRIVILEGES: 'select,insert,update,references',
    COLUMN_COMMENT: '',
    CONSTRAINT_CATALOG: 'def',
    CONSTRAINT_SCHEMA: 'modelizor_test',
    CONSTRAINT_NAME: 'pets_ibfk_1',
    POSITION_IN_UNIQUE_CONSTRAINT: 1,
    REFERENCED_TABLE_SCHEMA: 'modelizor_test',
    REFERENCED_TABLE_NAME: 'users',
    REFERENCED_COLUMN_NAME: 'id' }
    */