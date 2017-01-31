function getTableDefinitionQuery(dbSchema, tableName, driver) {
    let q = "";
    switch (driver) {
        case "mysql":
            q = `SELECT 
						C.TABLE_NAME AS TABLE_NAME, 
						C.COLUMN_NAME AS COLUMN_NAME, 
						C.COLUMN_DEFAULT AS COLUMN_DEFAULT, 
						C.IS_NULLABLE AS IS_NULLABLE, 
						C.DATA_TYPE AS DATA_TYPE, 
						KCU.CONSTRAINT_NAME AS CONSTRAINT_NAME, 
						KCU.REFERENCED_TABLE_SCHEMA AS REFERENCED_TABLE_SCHEMA, 
						KCU.REFERENCED_TABLE_NAME AS REFERENCED_TABLE_NAME, 
						KCU.REFERENCED_COLUMN_NAME  AS REFERENCED_COLUMN_NAME
					FROM
						INFORMATION_SCHEMA.COLUMNS AS C 
						LEFT JOIN
							INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU 
							ON 
							C.TABLE_NAME = KCU.TABLE_NAME AND 
							C.TABLE_SCHEMA = KCU.TABLE_SCHEMA AND 
							C.COLUMN_NAME = KCU.COLUMN_NAME  
					WHERE 
						C.TABLE_NAME =  '${tableName}'  AND 
						C.TABLE_SCHEMA =  '${dbSchema}' ;`;
            return q;
        case "pg":
            q = `SELECT 
						C.TABLE_NAME AS TABLE_NAME, 
						C.COLUMN_NAME AS COLUMN_NAME, 
						C.COLUMN_DEFAULT AS COLUMN_DEFAULT, 
						C.IS_NULLABLE AS IS_NULLABLE, 
						C.DATA_TYPE AS DATA_TYPE, 
						KCU.CONSTRAINT_NAME AS CONSTRAINT_NAME, 
						KCU.TABLE_SCHEMA AS REFERENCED_TABLE_SCHEMA, 
						KCU.TABLE_NAME AS REFERENCED_TABLE_NAME, 
						KCU.COLUMN_NAME  AS REFERENCED_COLUMN_NAME
					FROM 
						INFORMATION_SCHEMA.COLUMNS AS C 
						LEFT JOIN 
							INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU 
							ON 
							C.TABLE_NAME = KCU.TABLE_NAME AND 
							C.TABLE_SCHEMA = KCU.TABLE_SCHEMA AND 
							C.COLUMN_NAME = KCU.COLUMN_NAME  
					WHERE 
						C.TABLE_NAME =  '${tableName}'  AND 
						C.TABLE_SCHEMA =  '${dbSchema}' ;`;
            return q;
        default:
            console.error("Unsupported driver")
            break;
    }
}

exports.getTableDefinitionQuery = getTableDefinitionQuery;