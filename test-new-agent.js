#!/usr/bin/env node

// اختبار سريع للملفات الجديدة
import { createAgentClient } from './dist/agent-client.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.log('❌ API Key مفقود');
  process.exit(1);
}

console.log('🧪 اختبار Agent الجديد...\n');

const agent = createAgentClient({
  apiKey,
  workingDirectory: process.cwd()
});

// اختبار بسيط
agent.run('اقرأ ملف package.json واعرض اسم المشروع فقط')
  .then(response => {
    console.log('\n✅ الرد:', response);
    console.log('\n📊 الإحصائيات:', agent.getStats());
  })
  .catch(error => {
    console.error('\n❌ خطأ:', error.message);
  });
