 const model = require('./model.js');
 const field = require('./field.js');
 const type = require('./type.js');
 const imports = require('./imports.js');
 const fs = require('fs')

 function create(conf, results) {

     tableName = results.ownColumns[0].TABLE_NAME;
     let typeName = type.create(tableName);
     let importObj = {};
     let fields = results.ownColumns.map((row) => {
         let f = field.structField(row);
         //can only be time right now, make generic if this grows
         if (f.indexOf("time.") !== -1) {
             importObj["time"] = true
         }
         return f
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

     let importsArr = conf.imports.concat(Object.keys(importObj))
     let importString = imports.create(importsArr)
     completedFile = model.create(typeName, fields, audCopyFields, audTableName, importString, conf.dbGetter);
     //@TODO: Outputdir should be in conf, along with some rules if you want in different folders (mainly for java i guess)
     return {
         name: typeName + ".go",
         content: completedFile
     }



 }

 exports.create = create;