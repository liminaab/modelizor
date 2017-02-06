 const model = require('./model.js');
 const field = require('./field.js');
 const type = require('./type.js');
 const fs = require('fs')

 function create(conf, results) {

     tableName = results.ownColumns[0].TABLE_NAME;
     let typeName = type.create(tableName);

     let fields = results.ownColumns.map((row) => {
         return field.structField(row);
     })

     fields = fields.concat(results.hasMany.map((row) => {
         return field.relationHasMany(row)
     }))

     fields = fields.concat(results.many2Many.map((row) => {
         return field.relationMany2Many(row);
     }))

     fields = fields.concat(results.ownColumns.map((row) => {
         return field.relationHasOne(conf.fk_prefix, row)
     }).filter(row => {
         return row !== undefined
     }))

     //@TODO: Add belongsTo

     //@TODO: Add audit for many2many?
     //@TODO: Add option to toggle if there should be audit functionality in the conf
     let audTableName = tableName + "_aud";

     let audCopyFields = results.ownColumns.map((row) => {
         return field.copyField(row);
     })

     completedFile = model.create(typeName, fields, audCopyFields, audTableName);
     //@TODO: Outputdir should be in conf, along with some rules if you want in different folders (mainly for java maybe)
     fs.writeFileSync(__dirname + "/" + typeName + ".go", completedFile)

     return completedFile;

 }


 exports.create = create;