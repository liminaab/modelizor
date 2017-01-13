function createFile(fileTemplateFolder, results) {
	
	var generatorModel = require('./../file_templates/' + fileTemplateFolder + '/model.js');
	var generatorParam = require('./../file_templates/' + fileTemplateFolder + '/param.js');

	var tableName = results[0].TABLE_NAME;
	var body = generatorModel.createBody(tableName);

	var paramsBody = '';
	var variableDeclarations = '';
	for(var i=0; i<results.length; i++) {
		variableDeclarations += generatorParam.getVariableDeclaration(results[i]);
		paramsBody += generatorParam.createBody(results[i]);
	}

	body = body.replace('VARIABLES', variableDeclarations);
	body = body.replace('PARAMS', paramsBody);
	console.log(body);
}

exports.createFile = createFile;