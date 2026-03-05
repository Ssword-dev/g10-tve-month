const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const { app } = require("electron");

function getRootDir() {
  if (app.isPackaged) {
    // when packaged, runtime/backend are copied into resources via extraResources
    return process.resourcesPath;
  }
  // during development, root of workspace (two levels up from app directory)
  return path.resolve(__dirname, "..", "..");
}

function setup({ logger }) {
  // call the powershell script to start the backend server.
  logger.log(
    "INFO",
    `app.isPackaged=${app.isPackaged}, resourcesPath=${process.resourcesPath}`,
  );
  const rootDir = getRootDir();
  const activateScript = path.join(
    rootDir,
    "runtime",
    "scripts",
    "activate.ps1",
  );
  const startScript = path.join(rootDir, "runtime", "scripts", "start.ps1");

  logger.log("INFO", `setup rootDir=${rootDir}`);
  logger.log("INFO", `activator=${activateScript}`);
  logger.log("INFO", `starter=${startScript}`);

  if (!fs.existsSync(activateScript)) {
    const msg = `Activate script missing: ${activateScript}`;
    logger.log("ERROR", msg);
    throw new Error(msg);
  }
  if (!fs.existsSync(startScript)) {
    const msg = `Start script missing: ${startScript}`;
    logger.log("ERROR", msg);
    throw new Error(msg);
  }

  try {
    // Ensure the powershell script uses workspace root as STACK_HOME.
    const psCommand = `$env:STACK_HOME='${rootDir}'; & { . "${activateScript}"; & "${startScript}" }`;
    logger.log("INFO", `executing: powershell -Command ${psCommand}`);
    const result = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-Command", psCommand],
      { encoding: "utf8", stdio: "ignore", shell: false },
    );
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`PowerShell exited with code ${result.status}`);
    }
    logger.log("INFO", "Backend server startup initiated");
  } catch (error) {
    const nginxLog = path.join(rootDir, "runtime", "logs", "error.log");
    logger.log("ERROR", `Failed to start backend server: ${error.message}`);
    if (error.stdout) logger.log("ERROR", `stdout: ${error.stdout}`);
    if (error.stderr) logger.log("ERROR", `stderr: ${error.stderr}`);
    throw new Error(`Server setup failed: ${error.message}. See ${nginxLog}`);
  }
}

function teardown({ logger }) {
  // call the powershell script to stop the backend server.
  logger.log(
    "INFO",
    `teardown app.isPackaged=${app.isPackaged}, resourcesPath=${process.resourcesPath}`,
  );
  const rootDir = getRootDir();
  const activateScript = path.join(
    rootDir,
    "runtime",
    "scripts",
    "activate.ps1",
  );
  const stopScript = path.join(rootDir, "runtime", "scripts", "stop.ps1");

  try {
    // Run PowerShell to execute the shutdown scripts.
    const psCommand = `$env:STACK_HOME='${rootDir}'; & { . "${activateScript}"; & "${stopScript}" }`;
    const result = spawnSync(
      "powershell.exe",
      ["-NoProfile", "-Command", psCommand],
      { encoding: "utf8", stdio: "ignore", shell: false },
    );
    if (result.error) {
      throw result.error;
    }
    if (result.status !== 0) {
      throw new Error(`PowerShell exited with code ${result.status}`);
    }
    logger.log("INFO", "Backend server shutdown initiated");
  } catch (error) {
    logger.log("ERROR", `Failed to stop backend server: ${error.message}`);
    throw new Error(`Server teardown failed: ${error.message}`);
  }
}

module.exports = { setup, teardown };
