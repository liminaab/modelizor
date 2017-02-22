let drivers = require('../drivers.js');
let fs = require('fs');
let possibleDrivers = Object.keys(drivers).map((driver => drivers[driver]))
let possibleTargets = ['go', 'java'];

function validateConf(conf) {
    check(!conf.target, 'Must have property "target" (' + possibleTargets.join(", ") + ')');
    check(!conf.driver, 'Must have property "driver" (' + possibleDrivers.join(", ") + ')');
    check(!conf.user, 'Must have property "user" (db user to connect as)');
    check(!conf.database, 'Must have property "database" (name of database)');
    check(!conf.schema, 'Must have property "schema" (name of schema)');
    check(!conf.tables.length > 0, 'Must specify at least one table');
    check(!conf.outputdir, 'Must specify an "outputdir" relative to the config file, "." for same directory as the file');
    //@TODO: these only applicable when audit, make audit optional
    //check(conf.target === 'go' && !conf.imports, 'you must specify "imports" where you get your database from')
    //check(conf.target === 'go' && !conf.dbGetter, 'you must specify a db getter to use in the code to get db')


    unSupportedTarget = possibleTargets.indexOf(conf.target) === -1
    check(unSupportedTarget, 'Unsupported target' + conf.target);
}

function setDefaultValues(conf) {
    conf.host = conf.host || "localhost"
    conf.fk_prefix = conf.fk_prefix || "fk_"
    conf.outputdir = conf.outputdir || "."

}

function check(condition, str) {
    if (condition) {
        throw new Error(str);
    }
}

function get(confFilePath) {
    let path = getFilePathOfConf(confFilePath)
    let confFile = fs.readFileSync(confFilePath, "utf8")
    let confs = JSON.parse(confFile)

    if (typeof confs === "object" && !Array.isArray(confs)) {
        confs = [confs]
    }
    confs.forEach((conf) => {
        conf.outputdir = path + "/" + (conf.outputdir || "")
    })

    return confs
}

//make it relative to the conf file
function getFilePathOfConf(confFilePath) {
    let pathArr = confFilePath.split("/");
    pathArr.pop();
    let confpath = pathArr.join("/");
    let cwd = process.cwd();
    return cwd + "/" + confpath
}
exports.get = get
exports.validate = validateConf
exports.setDefaultValues = setDefaultValues