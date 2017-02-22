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

    paramsNotId = results.ownColumns.filter(row => {
       
        return row.COLUMN_NAME != "id"
    })
    console.log(paramsNotId)
    let c1 = field.createConstructor(tableName, paramsNotId)
    nonNullables = paramsNotId.filter(row => row.IS_NULLABLE == 'NO')
    let c2 = field.createConstructor(tableName, nonNullables)
    constructors = [c1]
    if(c1 != c2) {
        constructors.push(c2)
    }
    let importsUnique = removeImportDuplicates(conf.imports);

    importString = "import " + importsUnique.join(";\nimport ") + ";"
    body = body.replace("IMPORTS", importString);
    body = body.replace('VARIABLES', fields.join("\n"));
    body = body.replace('PARAMS', methods.join("\n"));
    body = body.replace('CONSTRUCTOR', constructors.join("\n\n"));
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