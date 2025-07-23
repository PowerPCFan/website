const { createInclude, build } = require("./buildFunctions"); // import functions from /buildFunctions.js
const { logError, logSuccess, logWarning, logInfo } = require("./log"); // import colored log functions

const headContent = `
    <!-- Charset -->
    <meta charset="UTF-8">

    <!-- Viewport -->
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bitter:ital,wght@0,100..900;1,100..900&family=Cabin:ital,wght@0,400..700;1,400..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Manrope:wght@200..800&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap" rel="stylesheet">
    
    <!-- Favicon -->
    <link rel="icon" href="favicon.ico" type="image/x-icon">
`

createInclude("{{ title }}", "PowerPCFan's Website");
createInclude("<!-- include: head -->", headContent);

build();







// Dev server stuff
const { exec } = require("child_process");

if (process.argv.includes("--serve")) {
    logSuccess("Starting server at http://localhost:3000...");
    logError("Press Ctrl+C to quit")
    exec("npx serve -l 3000 _site", (error, stdout, stderr) => {
        if (error) {
            logError(`An error occured: \x1b[0m ${error.message}`);
            return;
        }
        if (stderr) {
            logError(`[STDERR]\x1b[0m ${stderr}`);
        }
        logInfo(`[SERVE]\x1b[0m ${stdout}`);
    });
}
