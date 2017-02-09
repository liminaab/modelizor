var upperCamelCase = require('uppercamelcase');
var camelCase = require('camelcase');
var helpers = require('../../src/helpers')

function getVariableDeclaration(paramInfo) { // private
    return '	private ' + getType(paramInfo) + ' ' + createVariable(paramInfo) + ';';
}

function createGetSet(paramInfo) { // public
    var idRow = '';
    if (paramInfo.COLUMN_NAME == 'id') {
        idRow = '	@Id\n	GeneratedValue\n';
    }

    return '' +
        '	// ---- ---- ' + createVariableUpper(paramInfo) + ' ---- ---- //\n' +
        idRow +
        columnAnnotation(paramInfo) +
        '	public ' + getType(paramInfo) + ' get' + createVariableUpper(paramInfo) + '() {\n' +
        '		return ' + createVariable(paramInfo) + ';\n' +
        '	}\n' +
        '	public void set' + createVariableUpper(paramInfo) + '(' + getType(paramInfo) + ' ' + createVariable(paramInfo) + ') {\n' +
        '		this.' + createVariable(paramInfo) + ' = ' + createVariable(paramInfo) + ';\n' +
        '	}\n';
}

function createGetSetHasOne(paramInfo, typeName) { // public

    let annotation = '@Id @ManyToOne(cascade = CascadeType.ALL)'
    return `
    // ---- ----   ${upperCamelCase(typeName)}  ---- ---- //
    ${annotation}
    public ${upperCamelCase(typeName)} get${upperCamelCase(typeName)} () {
        //if null get from db with ${paramInfo.COLUMN_NAME}
        return  ${camelCase(typeName)};
    }
    public void set${upperCamelCase(typeName)} (${upperCamelCase(typeName)}  ${camelCase(typeName)} ) {
        this.${camelCase(typeName)} = ${camelCase(typeName)};
    };
`
}


function relationHasOne(conf, paramInfo) {
    let result = {};
    if (helpers.isHasOne(conf.fk_prefix, paramInfo)) {
        let name = helpers.removeTrailingId(paramInfo.COLUMN_NAME);
        result.field = '    private JPA' + upperCamelCase(name) + " " + camelCase(name) + ";";
        result.import = conf.models_import_path + "." + upperCamelCase(name) + ";"
        result.methods = createGetSetHasOne(paramInfo, name)
        return result
    }
}

function createVariableUpper(paramInfo) { // private
    return upperCamelCase(createVariable(paramInfo));
}

function createVariable(paramInfo) { // private
    return camelCase(paramInfo.COLUMN_NAME);
}

function columnAnnotation(paramInfo) { // private
    var nullable = 'true';
    if (paramInfo.IS_NULLABLE == 'NO') {
        nullable = 'false';
    }
    let annotation = '@Column(name = \"' + paramInfo.COLUMN_NAME + '\", nullable = ' + nullable + ')\n';
    if (paramInfo.REFERENCED_TABLE_NAME !== null && !/_id$/.test(paramInfo.COLUMN_NAME)) {
        //hmmm
    }
    return '	' + annotation

}

function getType(paramInfo) { // private
    var dbType = paramInfo.DATA_TYPE;
    switch (dbType) {
        case 'int':
        case 'integer':
        case 'serial':
        case 'bigserial':
            return 'Integer';
        case 'bigint':
            return 'Long';
        case 'tinyint':
            return 'Boolean';
        case 'double':
        case 'decimal':
            return 'Double';
        case 'float':
            return 'Float';
        case 'text':
        case 'character varying':
        case 'varchar':
            return 'String';
        case 'date':
        case 'timestamp with time zone':
            return 'ZonedDateTime';
        default:
            throw new Error('Can\'t handle data type:' + dbType);
    }
}

exports.createGetSet = createGetSet;
exports.getVariableDeclaration = getVariableDeclaration;
// exports.relationHasMany = relationHasMany;
exports.relationHasOne = relationHasOne;
// exports.copyField = copyField;
// exports.relationMany2Many = relationMany2Many;