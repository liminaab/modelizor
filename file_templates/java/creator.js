var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');

function create(conf, results) {
    var generatorModel = require('./model.js');
    var field = require('./param.js');
    console.log(results)
    let tableName = results.ownColumns[0].TABLE_NAME;
    var body = generatorModel.createBody(upperCamelCase(tableName));

    console.log(results)
    let fields = results.ownColumns.map((item) => {
        return field.getVariableDeclaration(item)
    })

    let methods = results.ownColumns.map((item) => {
        return field.createGetSet(item);
    })

    results.ownColumns.forEach((row) => {
        let f = field.relationHasOne(conf, row)
        if (f !== undefined) {
            fields.push(f.field)
            conf.imports.push(f.import)
            methods.push(f.methods)
        }
    })

    importString = "import " + conf.imports.join(";\nimport ") + ";"
    body = body.replace("IMPORTS", importString);
    body = body.replace('VARIABLES', fields.join("\n"));
    body = body.replace('PARAMS', methods.join("\n"));
    return {
        name: tableName + ".java",
        content: body
    }

}


exports.create = create;