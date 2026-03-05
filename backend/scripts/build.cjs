// backend build script to copy necessary files to artifacts/backend for distribution and install dependencies.
// this is a script that copies all backend source files to the artifacts/backend directory, 
// then runs composer install to set up production dependencies.

const { execSync, exec, spawn } = require("child_process");
const fs = require("fs");
const { existsSync, mkdirSync, readdirSync, lstatSync, copyFileSync, rmSync, copySync } = fs;
const { dirname, join } = require("path");
const { chdir } = require("process");
const { promisify } = require("util");

const execPromise = promisify(exec);

// On Windows, clean up any stray processes that might lock files
try {
    execSync("taskkill /IM mysqld.exe /F 2>nul", { stdio: "ignore", shell: true });
} catch (e) {
    // process may not be running, that's fine
}

// copy all files here to the artifacts/backend directory.
const srcDir = dirname(__dirname);
const destDir = join(dirname(srcDir), "artifacts", "backend");

// remove any existing build output before we start; avoids stale/deleted files
if (existsSync(destDir)) {
    console.log(`clearing previous build at ${destDir}`);
    
    // On Windows, files may be locked; retry with delay
    let removeSuccess = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            rmSync(destDir, { recursive: true, force: true });
            removeSuccess = true;
            break;
        } catch (e) {
            if (attempt < 3) {
                console.warn(`failed to remove on attempt ${attempt}, retrying in 1 second...`);
                // wait before retrying
                require('child_process').execSync('powershell -Command "Start-Sleep -Seconds 1"', { stdio: "ignore" });
            } else {
                console.warn(`could not remove old build directory (may be locked); proceeding with copy and overwrite`);
            }
        }
    }
}

// create the destination directory
if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
}

// directories to skip when copying (artifacts shouldn't be inside src but be defensive)
const skipDirs = new Set(["vendor", "node_modules", ".git", ".vscode", "artifacts"]);

// recursive copy function that skips certain directories
function copyDirRecursive(srcPath, destPath) {
    if (!existsSync(destPath)) {
        mkdirSync(destPath, { recursive: true });
    }
    
    readdirSync(srcPath).forEach(file => {
        if (skipDirs.has(file)) {
            return; // skip
        }
        
        const srcFile = join(srcPath, file);
        const destFile = join(destPath, file);
        const stat = lstatSync(srcFile);
        
        if (stat.isDirectory()) {
            copyDirRecursive(srcFile, destFile);
        } else if (stat.isFile()) {
            copyFileSync(srcFile, destFile);
        }
    });
}

// copy files directly into destDir
console.log(`copying backend sources from ${srcDir} to ${destDir}`);
copyDirRecursive(srcDir, destDir);

// change the working directory to the artifacts/backend directory.
chdir(destDir);

// remove any existing vendor directory before installation to avoid locked files
if (existsSync("vendor")) {
    try {
        rmSync("vendor", { recursive: true, force: true });
    } catch (e) {
        // ignore failures; composer install may still proceed
    }
}

// install the dependencies in the artifacts/backend directory, retrying twice on failure
function composerInstall() {
    try {
        execSync("composer install --no-dev --optimize-autoloader", { stdio: "inherit" });
        return true;
    } catch (err) {
        console.error("composer install failed, retrying...");
        return false;
    }
}

if (!composerInstall()) {
    // pause briefly and try once more
    execSync("powershell -Command \"Start-Sleep -Seconds 2\"", { stdio: "ignore" });
    if (!composerInstall()) {
        console.error("composer install failed twice; aborting build.");
        process.exit(1);
    }
}

// return to destDir (already there)


// if the runtime artifact directory exists, then run the required
// mysql commands to initialize the database.
const runtimeArtifactDir = dirname(srcDir) + "/artifacts/runtime";

if (existsSync(runtimeArtifactDir)) {
    chdir(runtimeArtifactDir);

    // activate the environment and run the mysql daemon.
    // use spawn instead of exec to get a process handle we can kill later
    // launch mysql inside the activated environment by passing entire command string
    console.log("starting MySQL daemon...");
    const daemonProcess = spawn(
        "powershell.exe -NoProfile -Command \"& { . './scripts/activate.ps1'; mysqld }\"",
        {
            stdio: "inherit",
            shell: true
        }
    );

    // wait for MySQL to start up before running queries (increased timeout for Windows)
    console.log("waiting for MySQL to be ready...");
    execSync("powershell.exe -NoProfile -Command \"Start-Sleep -Milliseconds 10000\"", { stdio: "pipe" });

    // run the SQL commands inside the same activated environment so `mysql` is on PATH
    // use Get-Content to pipe SQL into mysql; avoids PowerShell redirection errors
    // schema files are located in the backend artifact directory
    const schemaPath = join(destDir, "schema");
    const sqlCmd = `& { . './scripts/activate.ps1'; Get-Content '${schemaPath}\\schema.sql' | mysql -u root; Get-Content '${schemaPath}\\seed.prod.sql' | mysql -u root }`;
    
    try {
        console.log("initializing database with schema...");
        execSync(`powershell.exe -NoProfile -Command "${sqlCmd}"`, { stdio: "inherit", shell: true });
        console.log("database initialized successfully");
    } catch (err) {
        console.error("failed to initialize database:", err.message);
    }

    // finally, kill the mysql daemon process.
    console.log("stopping MySQL daemon...");
    daemonProcess.kill();
    
    // also ensure MySQL is fully terminated using taskkill
    try {
        execSync("taskkill /IM mysqld.exe /F", { stdio: "pipe" });
    } catch (e) {
        // process may already be terminated, suppress error
    }
}