const { accessSync } = require("fs");
const { enforcePNPMPackageManager } = require("./enforce-pnpm.js");
const { initializeGitRepository } = require("./init-git.js");
const { installGitSubmodules } = require("./install-git-submodules.js");
const { removeTemplateLicense } = require("./remove-template-license.js");

function fileOrDirExists(filePath) {
    try {
        accessSync(filePath);
        return true;
    } catch {
        return false;
    }
}

function prepareForInstallation() {
    if (process.env.GH_ACTION) return;
    if (fileOrDirExists(`${process.cwd()}/node_modules`)) return;

    console.log();
    enforcePNPMPackageManager();
    initializeGitRepository(); // Recommended for Foundry.
    installGitSubmodules().catch((error) => {
        console.error("Error when installing Git submodules:", error, "\n");
    });
    removeTemplateLicense().catch((error) => {
        console.error("Error when removing the template's license:", error, "\n");
    });
}

prepareForInstallation();
