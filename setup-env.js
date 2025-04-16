/**
 * Environment setup script
 * Helps users create their .env.local file
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default values
const defaultValues = {
  REACT_APP_API_URL: 'https://web-production-989cb.up.railway.app/api',
  REACT_APP_ENV: 'development'
};

console.log('\n=== Environment Setup ===\n');
console.log('This script will help you create your .env.local file with your API URL and settings.');
console.log('Press Enter to keep the default value shown in brackets.\n');

const questions = [
  {
    name: 'REACT_APP_API_URL',
    message: 'API URL',
    default: defaultValues.REACT_APP_API_URL
  },
  {
    name: 'REACT_APP_ENV',
    message: 'Environment (development/production)',
    default: defaultValues.REACT_APP_ENV
  }
];

const answers = {};

const askQuestion = (index) => {
  if (index >= questions.length) {
    writeEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(`${question.message} [${question.default}]: `, (answer) => {
    answers[question.name] = answer.trim() || question.default;
    askQuestion(index + 1);
  });
};

const writeEnvFile = () => {
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '# Local environment variables - created by setup script\n\n';
  
  for (const [key, value] of Object.entries(answers)) {
    envContent += `${key}=${value}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log(`\n✅ Created .env.local file with your settings!`);
  console.log(`File saved to: ${envPath}\n`);
  rl.close();
};

// Check if .env.local already exists
const envLocalPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  rl.question('.env.local already exists. Overwrite it? (y/n): ', (answer) => {
    if (answer.toLowerCase() === 'y') {
      askQuestion(0);
    } else {
      console.log('Setup cancelled. Your .env.local file was not modified.');
      rl.close();
    }
  });
} else {
  askQuestion(0);
} 