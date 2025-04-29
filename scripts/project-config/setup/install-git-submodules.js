const { readFile } = require("fs").promises;
const { execAsync } = require("./exec-async");
const { fileOrDirExists } = require("./file-or-dir-exists");

async function parseGitSubmodules() {
    const data = await readFile(`${process.cwd()}/.gitmodules`, "utf-8");
    const modules = {};
    const lines = data.split("\n");
    let currentModule = null;

    for (const line of lines) {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith("[submodule")) {
            if (currentModule) modules[currentModule.name] = currentModule;
            currentModule = { name: trimmedLine.split(" ")[1], url: "", path: "", branch: "" };
        } else if (trimmedLine.startsWith("url =")) currentModule.url = trimmedLine.split("=")[1].trim();
        else if (trimmedLine.startsWith("path =")) currentModule.path = trimmedLine.split("=")[1].trim();
        else if (trimmedLine.startsWith("branch =")) currentModule.branch = trimmedLine.split("=")[1].trim();
    }

    if (currentModule) modules[currentModule.name] = currentModule;

    return modules;
}

async function isSubmoduleInstalled(modulePath) {
    return fileOrDirExists(modulePath);
}

async function addSubmodule(m) {
    if (!m.url) throw new Error(`The URL for the submodule ${m.name} is missing.\n`);
    try {
        await execAsync(`git submodule add ${m.branch ? `-b ${m.branch} ` : ""}${m.url} ${m.path}`);
    } catch (error) {
        console.error("Failed to add submodule:", error, "\n");
    }
}

async function installGitSubmodules() {
    try {
        const modules = await parseGitSubmodules();
        for (const m of Object.values(modules)) if (!(await isSubmoduleInstalled(m.path))) await addSubmodule(m);
    } catch (error) {
        console.error("Error:", error, "\n");
    }
}

module.exports = { installGitSubmodules };
