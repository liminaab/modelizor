var upperCamelCase = require('uppercamelcase');
var camelCase = require('camelcase');
var pluralize = require('pluralize');
var helpers = require('../../src/helpers')

function structField(paramInfo) {
	return createVariableUpper(paramInfo.COLUMN_NAME) + '   ' + getType(paramInfo);
}

function copyField(paramInfo) {
	return 'aud.' + createVariableUpper(paramInfo.COLUMN_NAME) + ' = t.' + createVariableUpper(paramInfo.COLUMN_NAME);
}

//this one was easy to join in the main select, thats why we do a check on the column instead to see if there is a relation
function relationHasOne(fkPrefix, paramInfo) {
	if (helpers.isHasOne(fkPrefix, paramInfo)) {
		return createVariableUpper(paramInfo.COLUMN_NAME.replace(/_id$/, '')) + " " + createVariableUpper(paramInfo.COLUMN_NAME.replace(/_id$/, ''))
	}
}

function relationHasMany(relationInfo) {
	return createVariableUpper(relationInfo.TABLE_NAME) + '   []' + createVariableUpper(pluralize.singular(relationInfo.TABLE_NAME));
}

function relationMany2Many(relationInfo) {
	fieldNameWithoutId = relationInfo.COLUMN_NAME.replace(/_id$/, "");
	fieldName = createVariableUpper(pluralize(fieldNameWithoutId));

	typeName = createVariableUpper(fieldNameWithoutId);
	return fieldName + '   []' + typeName + '   `gorm:"many2many:' + relationInfo.TABLE_NAME + ';"`';
}

//@TODO: make function for this that checks different formats for "YES", depending on db, if there are differences
function isNullable(paramInfo) {
	return paramInfo.IS_NULLABLE === "YES";
}

function createVariableUpper(dbName) { // private
	let name = upperCamelCase(dbName);
	name = name.replace(/Id[^a-z|]|Id$/g, "ID")
	return name
}

function getType(paramInfo) {
	let result = "";
	var dbType = paramInfo.DATA_TYPE;
	switch (dbType) {
		case 'int':
		case 'integer':
			result = 'int';
			break;
		case 'serial':
		case 'bigserial':
			result = 'uint';
			break;
		case 'bigint':
			result = 'int64';
			break;
		case 'tinyint':
			result = 'bool';
			break;
		case 'double':
		case 'decimal':
		case 'numeric':
		case 'double precision':
			result = 'float64';
			break;
		case 'float':
			result = 'float32';
			break;
		case 'text':
		case 'character varying':
		case 'varchar':
			result = 'string';
			break;
		case 'date':
		case 'timestamp with time zone':
			result = 'time.Time';
			break;
		default:
			throw new Error('Can\'t handle data type:' + dbType);
	}

	if (isNullable(paramInfo)) {
		result = "*" + result;
	}
	return result;
}


exports.structField = structField;
exports.relationHasMany = relationHasMany;
exports.relationHasOne = relationHasOne;
exports.copyField = copyField;
exports.relationMany2Many = relationMany2Many;