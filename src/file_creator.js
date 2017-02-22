const fs = require('fs')
const ucc = require('uppercamelcase');
const dot = require('dot')


function createFile(conf, results) {
	alternativeWay(conf,results)
	let creator = require('./../file_templates/' + conf.target + '/creator.js');
	let file = creator.create(conf, results)
	fs.writeFileSync(conf.outputdir + "/" + file.name, file.content)
	console.log("created ", file.name)
}


//This is how we want to do it later (some version of this at least)
//to make the user able to create their own template with their own preferences.
//Should ship with sane defaults though
//Should support multiple templates as well, master layout with subtemplates making up the content
function alternativeWay(conf,results) {
	//preserve whitespace
	dot.templateSettings.strip = false
	
	let data = {conf: conf, fields:results, f: {}}
	template = fs.readFileSync(__dirname+'/template.test')
	//add functions we want inside the template
	data.f.ucc = ucc
	
	var tempFn = dot.template(template);
	var resultText = tempFn(data);
	//console.log(resultText)

}
exports.createFile = createFile;