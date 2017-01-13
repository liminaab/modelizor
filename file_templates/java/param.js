function getVariableDeclaration(paramInfo) { // private
	return '	private ' + getType(paramInfo) + ' ' + createVariable(paramInfo) + ';\n';
}

function createBody(paramInfo) { // public
	var idRow = '';
	if (paramInfo.COLUMN_NAME == 'id') {
		idRow = '	@Id\n	GeneratedValue\n';
	}

	return '' +
			'	// ---- ---- ' + createVariable(paramInfo) + ' ---- ---- //\n' +
			idRow +
			columnAnnotation(paramInfo) +
			'	public ' + getType(paramInfo) + ' get' + createVariable(paramInfo) + '() {\n' +
			'		return ' + createVariable(paramInfo) + ';\n' +
			'	}\n' +
			'	public void set' + createVariable(paramInfo) + '(' + getType(paramInfo) + ' ' + createVariable(paramInfo) + ') {\n' +
			'		this.' + createVariable(paramInfo) + ' = ' + createVariable(paramInfo) + ';\n' +
			'	}\n' +
			'\n';
}

function createVariable(paramInfo) { // private
	return paramInfo.COLUMN_NAME;
}

function columnAnnotation(paramInfo) { // private
	var nullable = 'true';
	if (paramInfo.IS_NULLABLE == 'NO') {
		nullable = 'false';
	}

	return '	' +
			'@Column(name = \"' + paramInfo.COLUMN_NAME + '\", nullable = ' + nullable + ')\n';
}

function getType(paramInfo) { // private
	var dbType = paramInfo.DATA_TYPE;
	switch (dbType) {
		case 'int':
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
			return 'String';
		case 'date':
			return 'ZonedDateTime';
		default:
			throw new Error('Can\'t handle data type:' + dbType);
	}
}

exports.createBody = createBody;
exports.getVariableDeclaration = getVariableDeclaration;
