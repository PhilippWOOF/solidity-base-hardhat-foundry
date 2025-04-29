const { access } = require("fs").promises;

async function fileOrDirExists(filePath) {
    try {
        await access(filePath);
        return true;
    } catch {
        return false;
    }
}

module.exports = { fileOrDirExists };
