var upperCamelCase = require('uppercamelcase');
var camelCase = require('camelcase');

function create(paramInfo) { // private
    return ' ' + createVariableUpper(paramInfo) + ' ' + getType(paramInfo);
}

function isNullable(paramInfo) {
    return paramInfo.IS_NULLABLE === "YES";
}

function createVariableUpper(paramInfo) { // private
    return upperCamelCase(paramInfo.COLUMN_NAME);
}

function getType(paramInfo) {
    let result = "";
    var dbType = paramInfo.DATA_TYPE;
    switch (dbType) {
        case 'int':
        case 'integer':
            result = 'int';
            break;
        case 'bigint':
            result = 'int64';
            break;
        case 'tinyint':
            result = 'int';
            break;
        case 'double':
        case 'decimal':
            result = 'float32';
            break;
        case 'float':
            result = 'float32';
            break;
        case 'text':
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


exports.create = create;