const { writeFile } = require("fs").promises;
const { join } = require("path");
const { suggestOptionalDependencies } = require("./install-optional-deps.js");
const { suggestAuditMode } = require("./suggest-audit-mode.js");
const { suggestWorkflows } = require("./suggest-github-workflows.js");
const { fileOrDirExists } = require("./file-or-dir-exists.js");

async function createFileInitialized() {
    const fileName = ".initialized";
    try {
        await writeFile(join(__dirname, fileName), "");
    } catch (err) {
        console.error(`Error when creating the file ${fileName}: ${err}\n`);
    }
}

async function finalizeAfterInstallation() {
    if (process.env.GH_ACTION) return;
    if (await fileOrDirExists(join(__dirname, ".initialized"))) return;

    console.log("Starting project setup...\n");

    await suggestOptionalDependencies();
    await suggestAuditMode();
    await suggestWorkflows();
    await createFileInitialized();
    console.log("\nSetup completed successfully.");
}

finalizeAfterInstallation().catch((error) => {
    console.error("Error:", error, "\n");
    process.exitCode = 1;
});
