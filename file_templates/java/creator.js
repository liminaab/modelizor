function create(results) {
    var generatorModel = require('./model.js');
    var generatorParam = require('./param.js');

    var tableName = results[0].TABLE_NAME;
    var body = generatorModel.createBody(tableName);

    var paramsBody = '';
    var variableDeclarations = '';
    for (var i = 0; i < results.length; i++) {
        variableDeclarations += generatorParam.getVariableDeclaration(results[i]);
        paramsBody += generatorParam.createBody(results[i]);
    }

    body = body.replace('VARIABLES', variableDeclarations);
    body = body.replace('PARAMS', paramsBody);
    console.log(body);

}


exports.create = create;