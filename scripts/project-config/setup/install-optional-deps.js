const { createPromptModule } = require("inquirer");
const { readFile, writeFile } = require("fs").promises;
const { join } = require("path");
const { execAsync } = require("./exec-async.js");

// Fetches the latest version of the `packageName` package.
async function getLatestVersion(packageName) {
    const version = await execAsync(
        `npm show ${packageName} version`,
        `Error when fetching the latest version for \`${packageName}\``
    );
    return `${packageName}@${version.trim()}`;
}

async function installPackages(packages, dev = false) {
    return execAsync(`pnpm add ${dev ? "-D " : ""}${packages.join(" ")}`, `Error when installing packages`);
}

async function updateHardhatConfig(imports) {
    if (!imports.length) return;

    const configPath = join(process.cwd(), "hardhat.config.ts");

    console.log("Adding new import statements to the Hardhat config...");
    for (const package of imports) {
        const importStatement = `import "${package}"`;
        try {
            let configContent = await readFile(configPath, "utf-8");

            // Check if the import statement already exists.
            if (!configContent.includes(importStatement)) {
                // Find the last import statement.
                const lastImportIndex = configContent.lastIndexOf("import");
                if (lastImportIndex !== -1) {
                    // Find the position of the second quote after the last import.
                    const quoteIndex = configContent.indexOf('"', lastImportIndex);
                    const endQuoteIndex = quoteIndex !== -1 ? quoteIndex : configContent.indexOf("'", lastImportIndex);

                    if (endQuoteIndex !== -1) {
                        // Determine the position to insert the new import statement.
                        const insertPosition = endQuoteIndex + 1; // After the quote.
                        // Check if there iss a semicolon after the import statement.
                        const semicolonIndex = configContent.indexOf(";", insertPosition);
                        const insertAfter = semicolonIndex !== -1 ? semicolonIndex + 1 : insertPosition;

                        // Insert the new import statement after the last one.
                        configContent = [
                            configContent.slice(0, insertAfter),
                            `\n${importStatement};`,
                            configContent.slice(insertAfter)
                        ].join("");
                    }
                }
                // If no imports are found, just append it to the beginning.
                else configContent = importStatement + configContent;

                await writeFile(configPath, configContent, "utf-8");
            }
        } catch (error) {
            console.error(`Error when adding new import statements to the Hardhat config: ${error.message}\n`);
        }
    }
    console.log("New import statements added to the Hardhat config.");
}

async function moveDependencySection() {
    try {
        const packageJSONPath = join(process.cwd(), "package.json");
        const packageJSON = JSON.parse(await readFile(packageJSONPath, "utf-8"));
        // Check if `dependencies` and `devDependencies` exist.
        if (packageJSON.dependencies && packageJSON.devDependencies) {
            // Check if dependency sections are already in a good order.
            const keys = Object.keys(packageJSON);
            if (keys.indexOf("dependencies") > keys.indexOf("devDependencies")) {
                console.log("Moving the `dependencies` section before `devDependencies`...");
                const newPackageJSON = {};
                // Add properties before `devDependencies`.
                for (const key of keys) {
                    // `Add dependencies` before `devDependencies`.
                    if (key === "devDependencies") newPackageJSON.dependencies = packageJSON.dependencies;

                    newPackageJSON[key] = packageJSON[key];
                }

                await writeFile(packageJSONPath, JSON.stringify(newPackageJSON, null, 2));
                console.log("Moved `dependencies` successfully.");
            }
        }
    } catch (error) {
        console.error("Error:", error, "\n");
    }
}

async function suggestOptionalDependencies() {
    const prompt = createPromptModule();

    try {
        const initialAnswer = await prompt([
            {
                type: "confirm",
                name: "desires",
                message: `Would you like to install optional packages like OpenZeppelin Contracts?`,
                default: false
            }
        ]);
        if (!initialAnswer.desires) return;

        const ozContracts = await getLatestVersion("@openzeppelin/contracts");
        const ozContractsUpgradeable = await getLatestVersion("@openzeppelin/contracts-upgradeable");

        const questions = [
            {
                type: "confirm",
                name: "installOZContracts",
                message: `Install \`${ozContracts}\`?`,
                default: false
            },
            {
                type: "confirm",
                name: "installOZContractsUpgradeable",
                message: `Install \`${ozContractsUpgradeable}\`?`,
                default: false
            }
        ];
        const answers = await prompt(questions);

        const dependenciesToInstall = [];
        const devDependenciesToInstall = [];
        const importStatements = [];
        if (answers.installOZContracts) dependenciesToInstall.push(ozContracts);
        if (answers.installOZContractsUpgradeable) {
            dependenciesToInstall.push(ozContractsUpgradeable);

            // Suggest installing `@openzeppelin/hardhat-upgrades`.
            const ozHhUpgradesName = "@openzeppelin/hardhat-upgrades";
            const ozHhUpgrades = await getLatestVersion(ozHhUpgradesName);
            const suggestOZHhUpgrades = await prompt([
                {
                    type: "confirm",
                    name: "installOZHardhatUpgrades",
                    message: `Would you like to install \`${ozHhUpgrades}\` as well?`,
                    default: false
                }
            ]);

            if (suggestOZHhUpgrades.installOZHardhatUpgrades) {
                devDependenciesToInstall.push(ozHhUpgrades);
                importStatements.push(ozHhUpgradesName);
            }
        }

        if (dependenciesToInstall.length || devDependenciesToInstall.length) {
            const packages = [...dependenciesToInstall, ...devDependenciesToInstall].join(", ");
            console.log(`Installing packages...\nPackages: ${packages}.`);

            if (dependenciesToInstall.length) await installPackages(dependenciesToInstall);
            if (devDependenciesToInstall.length) await installPackages(devDependenciesToInstall, true);
        }

        await updateHardhatConfig(importStatements);
        await moveDependencySection();
    } catch (error) {
        console.error(error);
    }
}

module.exports = { suggestOptionalDependencies };
