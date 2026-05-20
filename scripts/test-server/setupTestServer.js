const { execSync } = require('node:child_process');

const PORT = 4444;
exports.PORT = PORT;
function isPortInUse() {
  try {
    execSync(`lsof -t -i:${PORT}`, { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}
exports.isPortInUse = isPortInUse;
