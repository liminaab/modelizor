function createFile(fileTemplateFolder, results) {
    let creator = require('./../file_templates/' + fileTemplateFolder + '/creator.js');
    let file = creator.create(results)

}

exports.createFile = createFile;