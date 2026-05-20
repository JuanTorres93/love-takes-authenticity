#!/usr/bin/env node
'use strict';

const { execSync } = require('child_process');
const { isPortInUse, PORT } = require('./setupTestServer');

if (!isPortInUse()) {
  console.log(`No test server running on port ${PORT}. Nothing to stop.`);
  process.exit(0);
}

console.log(`Stopping test server on port ${PORT}...`);

try {
  execSync(`kill $(lsof -t -i:${PORT})`, { stdio: 'inherit', shell: true });
  console.log('Test server stopped.');
} catch {
  console.error('Failed to stop test server.');
  process.exit(1);
}
