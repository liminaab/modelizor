 const model = require('./model.js');
 const field = require('./field.js');
 const type = require('./type.js');

 function create(results) {

     let typeName = type.create(results[0].TABLE_NAME);
     let fields = results.map((row) => {
         return field.create(row);
     })

     completedFile = model.create(typeName, fields);
     fs.writeFileSync(typeName + ".go", completedFile)

     return completedFile;

 }


 exports.create = create;