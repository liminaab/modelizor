function createBody(tableName) {
	return '' +
	'package '+ javaPackage +';\n'+
	'\n' +
	'import javax.persistence.Entity;\n' +
	'import javax.persistence.Table;\n' +
	'import org.hibernate.envers.Audited;\n' +
	'\n' +
	'/**\n' +
	' *		This class has been auto-generated by Modelizor.\n' +
	' *		For license information, please LICENSE file at\n' +
	' *		https://github.com/liminaab/modelizor\n' +
	' */\n' +
	'@Entity\n' +
	'@Table(name=\"'+tableName+'\")\n' +
	'@Audited\n' +
	'public class '+tableName+' {\n' +
	'\n' +
	'	public ' + tableName + '() {\n' +
	'		// auto-generated from Modelizor\n' +
	'	}\n' +
	'\n' +
	'	PARAMS\n' +
	'}\n' +
	'';
}

exports.createBody = createBody;