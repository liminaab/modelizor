let drivers = require("../drivers")

function getTableDefinitionQuery(conf) {
	switch (conf.driver) {
		case drivers.mysql:
			return `SELECT 
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
							AND KCU.constraint_name LIKE ('${conf.fk_prefix}%')
					WHERE 
						C.TABLE_NAME =  '${conf.table}'  AND 
						C.TABLE_SCHEMA =  '${conf.schema}';`;

		case drivers.postgres:
			return `SELECT 
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
						C.COLUMN_NAME = KCU.COLUMN_NAME AND
						KCU.constraint_name LIKE ('${conf.fk_prefix}%')
					WHERE 
						C.TABLE_NAME =  '${conf.table}'  AND 
						C.TABLE_SCHEMA =  '${conf.schema}' 
						 ;`;

		default:
			console.error("Unsupported driver in getTableDefinitionQuery:", conf.driver)
			break;
	}
}


function getRelationsToTable(conf) {
	switch (conf.driver) {
		case drivers.postgres:
			return `SELECT 
						KCU.TABLE_NAME,
						KCU.COLUMN_NAME
					FROM 
						INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS CCU
					INNER JOIN 
						INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS FK
					ON 
						CCU.CONSTRAINT_CATALOG = FK.UNIQUE_CONSTRAINT_CATALOG AND
						CCU.CONSTRAINT_SCHEMA = FK.UNIQUE_CONSTRAINT_SCHEMA AND
						CCU.CONSTRAINT_NAME = FK.UNIQUE_CONSTRAINT_NAME
					INNER JOIN 
						INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
					ON 
						KCU.CONSTRAINT_CATALOG = FK.CONSTRAINT_CATALOG AND
						KCU.CONSTRAINT_SCHEMA = FK.CONSTRAINT_SCHEMA AND
						KCU.CONSTRAINT_NAME = FK.CONSTRAINT_NAME
					WHERE 
						CCU.TABLE_NAME = '${conf.table}' AND 
						CCU.TABLE_SCHEMA = '${conf.schema}' AND
						KCU.TABLE_NAME NOT IN(${getMany2Many(conf,true)})
						;`
		default:
			console.error("Unsupported driver in getRelationsToTable: ", conf.driver)
			break;

	}

}

//Gets the other column name in linking tables that are linking to conf.table
function getMany2Many(conf, asSubQuery) {
	let fields = "";
	if (asSubQuery) {
		fields = "KCU2.table_name";
	} else {
		fields = "KCU2.column_name, KCU2.table_name";
	}
	switch (conf.driver) {
		case drivers.postgres:
			let q = `SELECT 
						${fields} 
					FROM 
						INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE AS CCU
					INNER JOIN 
						INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS AS FK
					ON 
						CCU.CONSTRAINT_CATALOG = FK.UNIQUE_CONSTRAINT_CATALOG AND
						CCU.CONSTRAINT_SCHEMA = FK.UNIQUE_CONSTRAINT_SCHEMA AND
						CCU.CONSTRAINT_NAME = FK.UNIQUE_CONSTRAINT_NAME
					INNER JOIN 
						INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU
					ON 
						KCU.CONSTRAINT_CATALOG = FK.CONSTRAINT_CATALOG AND
						KCU.CONSTRAINT_SCHEMA = FK.CONSTRAINT_SCHEMA AND
						KCU.CONSTRAINT_NAME = FK.CONSTRAINT_NAME
					INNER JOIN 
						INFORMATION_SCHEMA.KEY_COLUMN_USAGE as KCU2
					ON 
						KCU.CONSTRAINT_CATALOG = KCU2.CONSTRAINT_CATALOG AND
						KCU.CONSTRAINT_SCHEMA = KCU2.CONSTRAINT_SCHEMA AND
						KCU.table_name = KCU2.table_name AND
						KCU.column_name != KCU2.column_name
												
					WHERE 
						CCU.TABLE_NAME = '${conf.table}' AND 
						KCU2.constraint_name LIKE('${conf.fk_prefix}%') AND 
						KCU.constraint_name LIKE('${conf.fk_prefix}%') AND 
						CCU.TABLE_SCHEMA = '${conf.schema}'`


			return q
		default:
			console.error("Unsupported driver in getRelationsToTable: ", conf.driver)
			break;

	}

}

exports.getTableDefinitionQuery = getTableDefinitionQuery;
exports.getRelationsToTable = getRelationsToTable;
exports.getMany2Many = getMany2Many;