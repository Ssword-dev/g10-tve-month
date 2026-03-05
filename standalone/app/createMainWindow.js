const { BrowserWindow } = require("electron");
const path = require("path");
const APP_URL = "http://127.0.0.1:80";

function createMainWindow({ logger }) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.setMenuBarVisibility(false);

  win.loadURL(APP_URL);
  logger.log("INFO", "Application window created and loading server");
  return win;
}

module.exports.default = createMainWindow;
