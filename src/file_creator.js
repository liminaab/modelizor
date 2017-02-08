const fs = require('fs')

function createFile(conf, results) {
    let creator = require('./../file_templates/' + conf.target + '/creator.js');
    let file = creator.create(conf, results)
    fs.writeFileSync(__dirname + "/outputdir/" + file.name, file.content)
    console.log("created ", file.name)
}

exports.createFile = createFile;