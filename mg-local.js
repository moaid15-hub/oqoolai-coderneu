#!/usr/bin/env node
// mg-local.js
// ============================================
// 🚀 MuayadGen المحلي المبسط
// ============================================

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// تحميل متغيرات البيئة
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

// وضع المحادثة التفاعلي
async function chatMode(client) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: '\x1b[33m👤 أنت:\x1b[0m '
  });

  // إضافة System Prompt للتركيز على البرمجة
  const messages = [
    {
      role: 'system',
      content: `أنت MuayadGen - مساعد برمجة ذكي ومحاور متقدم من تطوير Dr. Muayad.

## 🎯 دورك المزدوج:

### 1️⃣ عند طلب كود صريح:
إذا قال المستخدم: "اصنع"، "اكتب"، "أنشئ"، "طوّر"، "عدّل" + شيء برمجي
👉 اكتب الكود مباشرة بهذا التنسيق:
\`\`\`filename:اسم_الملف.ext
// الكود مع تعليقات عربية
\`\`\`

### 2️⃣ عند الأسئلة العادية أو الحوار:
إذا سأل عنك، أو عن مجلد، أو شيء غير واضح
👉 أجب بشكل طبيعي ومفيد بدون كتابة كود!

## 💬 أمثلة:

**طلب كود واضح:**
- "اصنع ملف hello.js" → اكتب الكود
- "اكتب دالة لحساب المتوسط" → اكتب الكود
- "طور API بسيط" → اكتب الكود

**سؤال عادي:**
- "من أنت؟" → أجب: "أنا MuayadGen..."
- "ما هذا المجلد؟" → اشرح أو اسأل للتوضيح
- "muayad" → اسأل: "ماذا تريد أن أفعل؟"

## ✅ قدراتك:
- كتابة أكواد بجميع اللغات
- المحادثة والإجابة على الأسئلة
- شرح المفاهيم البرمجية
- المساعدة في حل المشاكل

## 🎯 كن ذكياً:
اقرأ الطلب جيداً - هل يريد كود أم محادثة؟`
    }
  ];

  rl.prompt();

  rl.on('line', async (line) => {
    const input = line.trim();

    // الخروج
    if (!input || input.toLowerCase() === 'exit' || input === 'خروج') {
      console.log('\n\x1b[33m👋 إلى اللقاء!\x1b[0m\n');
      rl.close();
      process.exit(0);
    }

    // إضافة رسالة المستخدم
    messages.push({
      role: 'user',
      content: input
    });

    // إرسال للـ API مع Agent
    console.log('\x1b[90m⚡ جاري المعالجة...\x1b[0m\n');
    const response = await client.chatWithAgent(messages);

    if (!response.success) {
      console.log(`\x1b[31m❌ خطأ: ${response.error}\x1b[0m\n`);
      messages.pop(); // إزالة الرسالة الأخيرة
      rl.prompt();
      return;
    }

    // إضافة رد Claude
    messages.push({
      role: 'assistant',
      content: response.message
    });

    // عرض الرد
    const hasCode = response.message.includes('```');
    const label = hasCode ? '✨ الكود:' : '💬 الرد:';
    console.log(`\x1b[32m${label}\x1b[0m`);
    console.log('\x1b[37m' + response.message + '\x1b[0m\n');
    console.log('\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n');

    rl.prompt();
  });

  rl.on('close', () => {
    console.log('\n\x1b[33m👋 إلى اللقاء!\x1b[0m\n');
    process.exit(0);
  });
}

// استيراد الوحدات المبنية
import('./dist/agent-claude-client.js').then(async (claudeModule) => {
  const { AgentClaudeClient } = claudeModule;

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === 'your-api-key-here') {
    console.log('\x1b[33m⚠️  ANTHROPIC_API_KEY غير موجود أو غير صحيح\x1b[0m');
    console.log('\x1b[36mأضف المفتاح في ملف .env:\x1b[0m');
    console.log('\x1b[90mANTHROPIC_API_KEY=sk-ant-...\x1b[0m\n');
    process.exit(1);
  }

  const client = new AgentClaudeClient(apiKey, process.cwd());

  // عرض Banner جميل
  console.log('\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
  console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
  console.log('\x1b[36m║\x1b[0m     \x1b[1m\x1b[35m🧠  MuayadGen - مولّد الأكواد الذكي  🚀\x1b[0m        \x1b[36m║\x1b[0m');
  console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
  console.log('\x1b[36m║\x1b[0m     \x1b[33mأداة ذكية لكتابة الأكواد بواسطة Dr. Muayad\x1b[0m     \x1b[36m║\x1b[0m');
  console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
  console.log('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
  console.log('');

  // التحقق من الاتصال
  console.log('\x1b[36m🔍 التحقق من الاتصال...\x1b[0m');
  const isValid = await client.verifyApiKey();

  if (!isValid) {
    console.log('\x1b[31m❌ فشل في الاتصال\x1b[0m');
    console.log('\x1b[33mتحقق من صحة API Key في ملف .env\x1b[0m\n');
    process.exit(1);
  }

  console.log('\x1b[32m✅ جاهز للعمل!\x1b[0m\n');

  // الحصول على الأمر
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('\x1b[36m╔══════════════════════════════════════════════════════════╗\x1b[0m');
    console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m         \x1b[1m\x1b[35m💬 وضع المحادثة التفاعلي 💬\x1b[0m                \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m     \x1b[90mاكتب طلبك البرمجي واضغط Enter\x1b[0m                  \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m     \x1b[90mللخروج: اكتب "exit" أو "خروج"\x1b[0m                  \x1b[36m║\x1b[0m');
    console.log('\x1b[36m║\x1b[0m                                                          \x1b[36m║\x1b[0m');
    console.log('\x1b[36m╚══════════════════════════════════════════════════════════╝\x1b[0m');
    console.log('');

    // الدخول في وضع المحادثة التفاعلي
    await chatMode(client);
    return;
  }

  const prompt = args.join(' ');

  console.log(`\x1b[36m📝 الطلب: ${prompt}\x1b[0m\n`);

  // إرسال الطلب مع Agent
  const response = await client.runAgent(prompt);

  if (!response.success) {
    console.log(`\x1b[31m❌ خطأ: ${response.error}\x1b[0m\n`);
    process.exit(1);
  }

  // عرض الرد
  const hasCode = response.message.includes('```');
  const label = hasCode ? '✨ الكود المُولّد:' : '💬 الرد:';
  console.log(`\x1b[32m${label}\x1b[0m\n`);
  console.log('\x1b[37m' + response.message + '\x1b[0m\n');

  console.log('\x1b[90m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n');

}).catch((error) => {
  console.error('\x1b[31m❌ خطأ في التحميل:\x1b[0m', error.message);
  process.exit(1);
});
