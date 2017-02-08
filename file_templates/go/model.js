var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(typeName, fields, audCopyFields, audTable, imports, dbGetter) {

    let fieldString = fields.join("\n\t")

    let audCopy = audCopyFields.join("\n\t")
    let importsJoined = imports.join("\"\n\t\"")
    var importString = `import (
    "${importsJoined}"
)`
    var typeNameAud = typeName + "Aud";

    return `package models

${importString}

/**
 *		This class has been auto-generated by Modelizor.
 *		For license information, please LICENSE file at
 *		https://github.com/liminaab/modelizor
 */

type ${typeName} struct {
	${fieldString}
}

type ${typeNameAud} struct {
	PK_ID uint \`gorm:"primary_key"\`
	${fieldString} 
}

func(t ${typeName}) ToAudit() ${typeNameAud} {
	aud := ${typeNameAud}{}
	${audCopy}
	return aud
}

func(t ${typeName}) AfterSave() {
	aud := t.ToAudit()
	${dbGetter}.Create(&aud)
}

func(${typeNameAud}) TableName() string {
    return "${audTable}"
}
`

}



exports.create = create;