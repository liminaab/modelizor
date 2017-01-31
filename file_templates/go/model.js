var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(type, fields) {
    var modeltpl = fs.readFileSync(__dirname + '/model', 'utf8');
    let temp = modeltpl.replace(/TYPE_NAME/g, type)
    temp = temp.replace(/FIELDS/g, fields.join("\n\t"))
    outputFileContent = temp
    return outputFileContent
}

exports.create = create;