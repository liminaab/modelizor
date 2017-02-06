 const model = require('./model.js');
 const field = require('./field.js');
 const type = require('./type.js');
 const fs = require('fs')

 function create(conf, results) {
     tableName = results.ownColumns[0].TABLE_NAME;
     let typeName = type.create(tableName);

     let audTableName = tableName + "_aud";

     let fields = results.ownColumns.map((row) => {
         return field.structField(row);
     })

     let audCopyFields = results.ownColumns.map((row) => {
         return field.copyField(row);
     })

     let relations = results.hasMany.map((row) => {
         return field.relationHasMany(row)
     })

     relations = relations.concat(results.many2Many.map((row) => {
         return field.relationMany2Many(row);
     }))

     relations = relations.concat(results.ownColumns.map((row) => {
         return field.relationHasOne(conf.fk_prefix, row)
     }).filter(row => {
         return row !== undefined
     }))

     fields = fields.concat(relations)

     completedFile = model.create(typeName, fields, audCopyFields, audTableName);
     fs.writeFileSync(__dirname + "/" + typeName + ".go", completedFile)

     return completedFile;

 }


 exports.create = create;