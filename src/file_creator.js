function createFile(conf, results) {
    let creator = require('./../file_templates/' + conf.target + '/creator.js');
    let file = creator.create(conf, results)
}

exports.createFile = createFile;