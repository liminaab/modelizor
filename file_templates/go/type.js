var upperCamelCase = require('uppercamelcase');
var pluralize = require('pluralize');
var fs = require('fs');


function create(tableName) {
    return upperCamelCase(pluralize.singular(tableName));
}

exports.create = create;