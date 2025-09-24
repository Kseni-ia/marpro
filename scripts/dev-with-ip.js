#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

// Function to get local IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  // On macOS, try en0 first (primary WiFi interface)
  if (process.platform === 'darwin' && interfaces.en0) {
    for (const alias of interfaces.en0) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  
  // Fallback: look through all interfaces
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      
      // Look for IPv4, non-internal (not 127.0.0.1), and not Docker/VM interfaces
      if (alias.family === 'IPv4' && 
          alias.address !== '127.0.0.1' && 
          !alias.internal &&
          !devName.includes('docker') &&
          !devName.includes('veth') &&
          !devName.includes('br-')) {
        return alias.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();
const port = process.env.PORT || 3002;

console.log('\n🚀 Starting development server...');
console.log(`\n📱 Local WiFi Address: http://${localIP}:${port}`);
console.log(`🌍 Network Access: http://0.0.0.0:${port}`);
console.log(`🏠 Local: http://localhost:${port}\n`);

// Start Next.js dev server
const nextDev = spawn('npx', ['next', 'dev', '-p', port.toString(), '-H', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

nextDev.on('close', (code) => {
  process.exit(code);
});

nextDev.on('error', (err) => {
  console.error('Failed to start development server:', err);
  process.exit(1);
}); 