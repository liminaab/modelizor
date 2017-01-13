function createFile(fileTemplateFolder, results) {
	var generatorModel = require('./../file_templates/' + fileTemplateFolder + '/model.js');
	var generatorParam = require('./../file_templates/' + fileTemplateFolder + '/param.js');

	var tableName = results[0].TABLE_NAME;
	var body = generatorModel.createBody(tableName);

	var paramsBody = '';
	for(var i=0; i<results.length; i++) {
		var paramBody = generatorParam.createBody(results[i]);
		console.log(paramBody);
		break;
	}
/*
	body.replace('PARAMS', paramBody);
	console.log(body);*/
}

exports.createFile = createFile;