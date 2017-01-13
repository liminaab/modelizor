function createBody(tableName) {
	return '' +
	'import org.hibernate.envers.Audited;' +
	'' +
	'@Table(name=\"'+tableName
	'@Audited' +
	'public class '+classname+' {\n' +
	'	PARAMS\n' +
	'}\n' +
	'';
}

exports.createBody = createBody;