const fs = require("fs");
const path = require("path");

const { logError, logSuccess, logWarning, logInfo } = require("./log"); // import colored log functions

const includes = [];
const sourceDir = process.cwd();
const targetDir = path.join(sourceDir, "_site");

// Function to register new includess (for use in build.js)
function createInclude(placeholder, replacement) {
    includes.push({ placeholder, replacement });
}

// Recursively copy files excluding ones in skipList constant
function copyFiles(srcDir, destDir) {
    if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

    const skipList = ["_site", ".git", "node_modules", "build.js", "buildFunctions.js", "log.js", ".prettierrc", ".vscode", ".gitignore", "README.md"];

    for (const item of fs.readdirSync(srcDir)) {
        if (skipList.includes(item)) continue;

        const srcPath = path.join(srcDir, item);
        const destPath = path.join(destDir, item);
        const stats = fs.statSync(srcPath);

        if (stats.isDirectory()) {
            copyFiles(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// Process files
function processFiles(dir) {
    for (const item of fs.readdirSync(dir)) {
        const filePath = path.join(dir, item);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            processFiles(filePath);
        } else {
            let content = fs.readFileSync(filePath, "utf-8");
            let changed = false;

            includes.forEach(({ placeholder, replacement }) => {
                if (content.includes(placeholder)) {
                    content = content.split(placeholder).join(replacement);
                    changed = true;
                }
            });

            if (changed) {
                fs.writeFileSync(filePath, content, "utf-8");
            }
        }
    }
}

// Build static site
function build() {
    try {
        logInfo("Building site...");

        fs.rmSync("_site", { recursive: true, force: true }); // remove _site
        copyFiles(sourceDir, targetDir); // copy all files except for excluded files to _site
        processFiles(targetDir); // process files in _site

        logSuccess("Success");
    } catch (err) {
        logError(`Error: ${err.message}`);
    }
}

// Export functions for use in build.js
module.exports = {
    createInclude,
    build,
};
