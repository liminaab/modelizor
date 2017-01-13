function createFile(fileTemplateFolder, results) {
	var generatorModel = require('./../file_templates/' + fileTemplateFolder + '/model.js');
	var generatorParam = require('./../file_templates/' + fileTemplateFolder + '/param.js');

	var tableName = results[0].TABLE_NAME;
	var body = generatorModel.createBody(tableName);
	console.log(body);
}

exports.createFile = createFile;