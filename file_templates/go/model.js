var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(type, fields) {
    var modeltpl = fs.readFileSync(__dirname + '/model', 'utf8');
    let fileContent = modeltpl.replace(/TYPE_NAME/g, type)
    fieldString = fields.join("\n\t")
    fileContent = fileContent.replace(/FIELDS/g, fieldString)
    return fileContent
}

exports.create = create;