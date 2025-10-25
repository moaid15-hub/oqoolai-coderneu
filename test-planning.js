#!/usr/bin/env node

// اختبار Planning System
import { createAgentClient } from './dist/agent-client.js';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.ANTHROPIC_API_KEY;

if (!apiKey) {
  console.log('❌ API Key مفقود');
  process.exit(1);
}

console.log('🧪 اختبار Planning System...\n');

const agent = createAgentClient({
  apiKey,
  workingDirectory: process.cwd(),
  enablePlanning: true,
  enableContext: true
});

// اختبار مهمة معقدة تحتاج تخطيط
agent.run('أضف ملف جديد example.js يحتوي على function بسيطة لحساب مجموع رقمين')
  .then(response => {
    console.log('\n✅ النتيجة:', response);
    console.log('\n📊 الإحصائيات:', agent.getStats());
  })
  .catch(error => {
    console.error('\n❌ خطأ:', error.message);
  });
