#!/usr/bin/env node

// Firebase Configuration Test Script
// Run this with: node test-firebase-config.js

console.log('🔥 Firebase Configuration Test');
console.log('================================');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID'
];

let allConfigured = true;

console.log('\n📋 Checking Environment Variables:');
console.log('-----------------------------------');

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  const status = value && value !== 'your-api-key-here' && value !== 'your-messaging-sender-id' && value !== 'your-app-id' ? '✅' : '❌';
  
  if (status === '❌') {
    allConfigured = false;
  }
  
  console.log(`${status} ${varName}: ${value ? (value.length > 20 ? value.substring(0, 20) + '...' : value) : 'NOT SET'}`);
});

console.log('\n🔍 Configuration Status:');
console.log('------------------------');

if (allConfigured) {
  console.log('✅ All Firebase environment variables are configured!');
  console.log('✅ You can now run: npm run dev');
  
  console.log('\n🔧 Next Steps:');
  console.log('1. Start your dev server: npm run dev');
  console.log('2. Check browser console for any Firebase errors');
  console.log('3. Test authentication and file uploads');
  
} else {
  console.log('❌ Some Firebase environment variables are missing or have placeholder values.');
  console.log('\n🔧 To fix this:');
  console.log('1. Go to: https://console.firebase.google.com/project/helper/settings/general');
  console.log('2. Scroll to "Your apps" section');
  console.log('3. Add a web app or view existing app config');
  console.log('4. Copy the config values to your .env.local file');
  console.log('5. Run this test again: node test-firebase-config.js');
}

console.log('\n📁 Expected .env.local location: ' + __dirname + '/.env.local');

// Check if .env.local exists
const fs = require('fs');
const envPath = '.env.local';

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file exists');
} else {
  console.log('❌ .env.local file not found!');
  console.log('   Create it in the matchmaker-app directory');
}

console.log('\n' + '='.repeat(50));