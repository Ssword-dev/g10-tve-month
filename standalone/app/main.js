const { app } = require("electron");
const logger = require("./logger");
const applyAppHooks = require("./applyAppHooks").default;
const { ready } = require("./readyApp");

// Apply app hooks and event listeners
applyAppHooks({ ready, logger });
