var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');

function create(conf, results) {
    var generatorModel = require('./model.js');
    var field = require('./param.js');

    let tableName = results.ownColumns[0].TABLE_NAME;
    var body = generatorModel.createBody(tableName);

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
            conf.imports = conf.imports.concat(f.imports)
            methods.push(f.methods)
        }
    })

    results.hasMany.forEach((row) => {
        let f = field.relationHasMany(conf, row)
        fields.push(f.field)
        conf.imports = conf.imports.concat(f.imports)
        methods.push(f.methods)
    })

    results.many2Many.forEach((row) => {
        let f = field.relationMany2Many(conf, row)
        fields.push(f.field)
        conf.imports = conf.imports.concat(f.imports)
        methods.push(f.methods)
    })

    // fields = fields.concat(results.many2Many.map((row) => {
    //     return field.relationMany2Many(row);
    // }))


    let importsUnique = removeImportDuplicates(conf.imports);

    importString = "import " + importsUnique.join(";\nimport ") + ";"
    body = body.replace("IMPORTS", importString);
    body = body.replace('VARIABLES', fields.join("\n"));
    body = body.replace('PARAMS', methods.join("\n"));
    return {
        name: tableName + ".java",
        content: body
    }

}

function removeImportDuplicates(imports) {
    var impObj = {}
    imports.forEach(row => {
        impObj[row] = true
    })
    return Object.keys(impObj);
}

exports.create = create;