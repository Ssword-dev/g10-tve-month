const path = require("path");
const fs = require("fs");
const { app } = require("electron");

const logDir = path.join(app.getPath("userData"), "logs");
const logFile = path.join(logDir, "app.log");

// repair legacy double-logs path
const legacyDir = path.join(app.getPath("userData"), "logs", "logs");
if (fs.existsSync(legacyDir)) {
  try {
    // move any files up one level
    fs.readdirSync(legacyDir).forEach((fname) => {
      const oldPath = path.join(legacyDir, fname);
      const newPath = path.join(logDir, fname);
      fs.renameSync(oldPath, newPath);
    });
    fs.rmdirSync(legacyDir);
  } catch (e) {
    // ignore if migration fails
    console.error("Log directory migration failed", e);
  }
}

// Ensure logs directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function log(level, message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  fs.appendFileSync(logFile, logMessage);
}

// dedicated logger module.
module.exports = { log, logFile };
