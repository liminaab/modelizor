function isHasOne(prefix, col) {
	return col.CONSTRAINT_NAME !== null && col.CONSTRAINT_NAME.indexOf(prefix) !== -1
}

function removeTrailingId(str) {
	let res = str.replace(/_id$/, '');
	return res
}
exports.isHasOne = isHasOne
exports.removeTrailingId = removeTrailingId