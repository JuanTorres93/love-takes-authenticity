#!/usr/bin/env node
'use strict';

const { execSync, spawn } = require('child_process');
const { isPortInUse, PORT } = require('./setupTestServer');

if (isPortInUse()) {
  console.log(`Test server already running on port ${PORT}. Skipping start.`);
  process.exit(0);
}

console.log('Building backend...');
execSync('npm run build -w backend', { stdio: 'inherit' });

console.log(`Starting test server on port ${PORT}...`);

const child = spawn('npm', ['run', 'start:test-server', '-w', 'backend'], {
  stdio: 'inherit',
  detached: true,
});

child.unref();
