var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(tableName) {
    var modeltpl = fs.readFileSync(__dirname + '/model', 'utf8');

    let outputFile = modeltpl.replace(/TYPE_NAME/g, upperCamelCase(tableName))

    return outputFile;
}

exports.create = create;