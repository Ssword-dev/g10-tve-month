const puppeteer = require("puppeteer");

module.exports = {
  launch: {
    headless: false,
    slowMo: 25,
    defaultViewport: null,
    executablePath: puppeteer.executablePath({ channel: "chrome" }),
    args: ["--start-maximized"],
  },
  browserContext: "default",
  exitOnPageError: true,
};
