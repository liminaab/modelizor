function createImport(i) {
    let importsJoined = i.join("\"\n\t\"")
    let importString = `import (
    "${importsJoined}"
)`

    return importString
}
exports.create = createImport