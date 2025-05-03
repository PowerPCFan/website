const colors = {
    reset: "\x1b[0m",
    red: "\x1b[91m",
    green: "\x1b[92m",
    yellow: "\x1b[93m",
    blue: "\x1b[94m",
};

function logError(msg) {
    console.log(`${colors.red}${msg}${colors.reset}`);
}

function logSuccess(msg) {
    console.log(`${colors.green}${msg}${colors.reset}`);
}

function logWarning(msg) {
    console.log(`${colors.yellow}${msg}${colors.reset}`);
}

function logInfo(msg) {
    console.log(`${colors.blue}${msg}${colors.reset}`);
}

module.exports = {
    logError,
    logSuccess,
    logWarning,
    logInfo,
};