var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(type, fields, audCopyFields, audTable) {
    var modeltpl = fs.readFileSync(__dirname + '/model', 'utf8');
    let fileContent = modeltpl.replace(/TYPE_NAME/g, type)
    fieldString = fields.join("\n\t")
    fileContent = fileContent.replace(/FIELDS/g, fieldString)

    audCopy = audCopyFields.join("\n\t")
    fileContent = fileContent.replace(/AUDIT_COPY/g, audCopy)
    fileContent = fileContent.replace(/AUDIT_TABLE/g, audTable)
    return fileContent
}

exports.create = create;