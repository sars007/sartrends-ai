#!/usr/bin/env node

console.log('🚀 Starting Sartrends AI...')

const { execSync } = require('child_process')

try {
  console.log('📦 Installing dependencies...')
  execSync('npm install', { stdio: 'inherit' })

  console.log('🔧 Generating Prisma client...')
  execSync('npx prisma generate', { stdio: 'inherit' })

  console.log('📊 Pushing database schema...')
  execSync('npx prisma db push', { stdio: 'inherit' })

  console.log('🌐 Starting dev server...')
  execSync('npm run dev', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Setup failed:', error.message)
  console.log('🔄 Retrying in 5 seconds...')
  setTimeout(() => {
    require('child_process').execSync('node blackbox.js', { stdio: 'inherit' })
  }, 5000)
}
