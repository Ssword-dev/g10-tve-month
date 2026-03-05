const http = require("http");
const SERVER_URL = "http://127.0.0.1:80";

function checkServerHealth() {
  return new Promise((resolve) => {
    const req = http.get(SERVER_URL, { timeout: 5000 }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

module.exports = { checkServerHealth };
