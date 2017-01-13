function createFile(fileTemplateFolder, results) {
	var generatorModel = require('./../file_templates/' + fileTemplateFolder + '/model.js');
	var generatorParam = require('./../file_templates/' + fileTemplateFolder + '/param.js');

	var tableName = results[0].TABLE_NAME;
	var body = generatorModel.createBody(tableName);

	var paramsBody = '';
	for(var i=0; i<results.length; i++) {
		var paramBody = generatorParam.createBody(results[i]);
		paramsBody += paramBody;
	}

	body = body.replace('PARAMS', paramsBody);
	console.log(body);
	console.log(results);
}

exports.createFile = createFile;