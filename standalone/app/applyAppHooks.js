const { BrowserWindow, app } = require("electron");
const lifecycle = require("./lifecycle");
const createMainWindow = require("./createMainWindow").default;

function applyAppHooks({ ready, logger }) {
  app.whenReady().then(() => ready({ app, logger, createMainWindow }));

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      try {
        createMainWindow({ logger });
      } catch (err) {
        logger.log(
          "ERROR",
          `Failed to create main window on activate: ${err.message}`,
        );
      }
    }

    // check if the window really is active.
    if (BrowserWindow.getAllWindows().length === 0) {
      logger.log("ERROR", "No windows found after activate event");
    }
  });

  app.on("before-quit", async () => {
    try {
      lifecycle.teardown({ logger });
      logger.log("INFO", "Application shutting down");
    } catch (error) {
      logger.log("ERROR", `Error during shutdown: ${error.message}`);
    }
  });
}

module.exports.default = applyAppHooks;
