const { dialog } = require("electron");
const { checkServerHealth } = require("./serverHealth");
const lifecycle = require("./lifecycle");

async function ready({ app, logger, createMainWindow }) {
  // log where the file is so user can open it easily
  logger.log("INFO", `Log file path: ${logger.logFile}`);

  try {
    lifecycle.setup({ logger });

    // Wait for server to be ready
    let retries = 0;
    let isHealthy = false;
    while (retries < 10 && !isHealthy) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      isHealthy = await checkServerHealth();
      retries++;
    }

    if (!isHealthy) {
      const errorMsg = `Server failed to respond after 10 seconds. Log file: ${logger.logFile}`;
      logger.log(
        "ERROR",
        "Server health check failed - not responding on localhost:80",
      );
      await dialog.showErrorBox("Server Connection Error", errorMsg);
      app.quit();
      return;
    }

    createMainWindow({ logger });
  } catch (error) {
    const errorMsg = `Failed to start server: ${error.message}. Log file: ${logger.logFile}`;
    logger.log("ERROR", `Server startup error: ${error.message}`);
    await dialog.showErrorBox("Server Startup Error", errorMsg);
    app.quit();
  }
}

module.exports = { ready };
