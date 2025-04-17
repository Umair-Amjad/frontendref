/**
 * Environment switcher script
 * Quickly switch between development and production environments
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Environment configurations
const environments = {
  development: {
    REACT_APP_API_URL: 'http://localhost:8000/api',
    REACT_APP_ENV: 'development'
  },
  production: {
    REACT_APP_API_URL: 'https://web-production-989cb.up.railway.app/api',
    REACT_APP_ENV: 'production'
  }
};

// Console output colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log('\n=== Environment Switcher ===\n');
console.log(`${colors.cyan}This script allows you to quickly switch between environments.${colors.reset}`);
console.log(`${colors.yellow}1. Development${colors.reset} - Uses your local backend (http://localhost:8000/api)`);
console.log(`${colors.magenta}2. Production${colors.reset} - Uses the Railway backend (https://web-production-989cb.up.railway.app/api)`);
console.log();

rl.question('Select environment (1 or 2): ', (answer) => {
  let env;
  
  if (answer === '1') {
    env = 'development';
  } else if (answer === '2') {
    env = 'production';
  } else {
    console.log(`${colors.yellow}Invalid selection. Please run the script again.${colors.reset}`);
    rl.close();
    return;
  }
  
  // Update .env.local file
  const envPath = path.join(__dirname, '.env.local');
  let envContent = `# Local environment overrides - set to ${env}\n\n`;
  
  for (const [key, value] of Object.entries(environments[env])) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  
  if (env === 'development') {
    console.log(`\n${colors.green}✅ Switched to DEVELOPMENT environment!${colors.reset}`);
    console.log(`${colors.cyan}The app will now use your local backend at http://localhost:8000/api${colors.reset}`);
    console.log(`${colors.yellow}Make sure your backend server is running locally.${colors.reset}`);
  } else {
    console.log(`\n${colors.green}✅ Switched to PRODUCTION environment!${colors.reset}`);
    console.log(`${colors.cyan}The app will now use the Railway backend at https://web-production-989cb.up.railway.app/api${colors.reset}`);
  }
  
  console.log(`\n${colors.yellow}Restart your React app for changes to take effect.${colors.reset}\n`);
  rl.close();
}); 