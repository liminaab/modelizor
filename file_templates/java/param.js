var upperCamelCase = require('uppercamelcase');
var camelCase = require('camelcase');
var pluralize = require('pluralize');

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

function relationHasOne(conf, paramInfo) {
	let result = {};
	if (helpers.isHasOne(conf.fk_prefix, paramInfo)) {

		let name = helpers.removeTrailingId(paramInfo.COLUMN_NAME);
		let typeName = upperCamelCase(name);
		let variableName = camelCase(name);
		result.field = '	private ' + typeName + " " + variableName + ";";
		result.imports = [conf.models_import_path + "." + typeName + ";"];
		result.methods = createGetSetHasOne(paramInfo, typeName, variableName)
		return result
	}
}

function createGetSetHasOne(paramInfo, typeName, variableName) { // public

	let annotation = `@ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)`
	return `
	// ---- ----   ${typeName}  ---- ---- //
	${annotation}
	public ${typeName} get${typeName} () {
		//if null get from db with ${paramInfo.COLUMN_NAME}
		return ${variableName};
	}
	public void set${typeName} (${typeName}  ${variableName} ) {
		this.${variableName}Id = ${variableName}.Id;
		this.${variableName} = ${variableName};
	};
`
}

function relationHasMany(conf, relationInfo) {
	let result = {};
	let typeName = upperCamelCase(pluralize.singular(relationInfo.TABLE_NAME));
	let variableName = camelCase(relationInfo.TABLE_NAME)
	result.field = '	private List<' + typeName + "> " + variableName + ";";
	result.imports = [conf.models_import_path + "." + typeName, "java.util.ArrayList", "java.util.List"]
	result.methods = createGetSetHasMany(relationInfo, typeName, variableName)
	return result

}

function createGetSetHasMany(relationInfo, typeName, variableName, currentType) { // public
	console.log(relationInfo, variableName)
	let singularVariableName = pluralize.singular(variableName)
	let typeNamePlural = pluralize(typeName)
	let annotation = `@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, mappedBy = "${camelCase(helpers.removeTrailingId(relationInfo.COLUMN_NAME))}", orphanRemoval = true)`
	return `
	// ---- ----   ${pluralize(typeName)}  ---- ---- //
	${annotation}
	public List<${typeName}> get${typeNamePlural} () {
		//if null get from db with ${relationInfo.COLUMN_NAME}
		return  ${variableName};
	}
	public void set${typeNamePlural} (List<${typeName}>  ${variableName} ) {
		this.${variableName} = ${variableName};
	};
	public boolean add${typeName} (${typeName}  ${singularVariableName} ) {
		return this.${variableName}.add(${singularVariableName});
	};
	public boolean remove${typeName} (${typeName}  ${singularVariableName} ) {
		return this.${variableName}.remove(${singularVariableName});
	};
`
}

function relationMany2Many(conf, relationInfo) {
	let result = {};
	let name = helpers.removeTrailingId(relationInfo.COLUMN_NAME)
	let typeName = upperCamelCase(pluralize.singular(name));
	let variableName = camelCase(pluralize(name))
	result.field = '	private List<' + typeName + "> " + variableName + ";";
	result.imports = [conf.models_import_path + "." + typeName, "java.util.ArrayList", "java.util.List"]
	result.methods = createGetSetMany2Many(relationInfo, typeName, variableName)
	return result

}

function createGetSetMany2Many(relationInfo, typeName, variableName) { // public
	let singularVariableName = pluralize.singular(variableName)
	let annotation = `@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name="${relationInfo.TABLE_NAME}")`
	return `
	// ---- ----   ${pluralize(typeName)}  ---- ---- //
	${annotation}
	public List<${typeName}> get${typeName} () {
		//if null get from  ${relationInfo.TABLE_NAME}
		return  ${variableName};
	}
	public void set${typeName} (List<${typeName}>  ${variableName} ) {
		this.${variableName} = ${variableName};
	};
	public boolean add${typeName} (${typeName}  ${singularVariableName} ) {
		return this.${variableName}.add(${singularVariableName});
	};
	public boolean remove${typeName} (${typeName}  ${singularVariableName} ) {
		return this.${variableName}.remove(${singularVariableName});
	};
`
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

function createConstructor(tableName, params) {
	if (params.length == 0) {
		return ""
	}
	let cArgs = params.map(p => {
		return `${getType(p)} ${createVariable(p)}`
	})
	let cBody = params.map(p => {
		return `this.${createVariable(p)} = ${createVariable(p)}`
	})
	constructorName = `	public ${upperCamelCase(pluralize.singular(tableName))}(${cArgs.join(', ')}) `
	constructorBody = `{
		${cBody.join(';\n\t\t')}
	}`

	return constructorName + constructorBody
}

//@TODO: this needs refactoring into a single method, make func that takes an object instead with {double: "Double" or "float64" depending on language}
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
		case 'numeric':
		case 'double precision':
			return 'Double';
		case 'float':
			return 'Float';
		case 'text':
		case 'character varying':
		case 'varchar':
			return 'String';
		case 'date':
		case 'timestamp with time zone':
			return 'Timestamp';
		default:
			throw new Error('Can\'t handle data type:' + dbType);
	}
}

exports.createGetSet = createGetSet;
exports.getVariableDeclaration = getVariableDeclaration;
exports.relationHasMany = relationHasMany;
exports.relationHasOne = relationHasOne;
exports.createConstructor = createConstructor;
exports.relationMany2Many = relationMany2Many;