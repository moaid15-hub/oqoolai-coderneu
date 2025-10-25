// local-claude-client.ts
// ============================================
// 🤖 عميل Claude المحلي - يستخدم API مباشرة
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import { Message, ChatResponse } from './api-client.js';

export class LocalClaudeClient {
  private client: Anthropic;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  // إرسال رسالة لـ Claude مباشرة
  async sendChatMessage(messages: Message[]): Promise<ChatResponse> {
    try {
      // تحويل الرسائل لصيغة Claude
      const claudeMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      // استخراج system message إذا وجدت
      const systemMessage = messages.find(msg => msg.role === 'system');

      // إرسال للـ API
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8192,
        system: systemMessage?.content,
        messages: claudeMessages
      });

      // استخراج النص من الرد
      const content = response.content[0];
      const messageText = content.type === 'text' ? content.text : '';

      return {
        success: true,
        message: messageText,
        usedProvider: 'claude-local'
      };
    } catch (error: any) {
      console.error(chalk.red('❌ خطأ في الاتصال بـ Claude:'), error.message);
      return {
        success: false,
        message: '',
        error: error.message
      };
    }
  }

  // توليد كود مع سياق الملفات
  async generateCode(
    prompt: string,
    fileContext: { path: string; content: string }[]
  ): Promise<ChatResponse> {
    try {
      // بناء رسالة System مع سياق الملفات
      const contextMessage = this.buildContextMessage(fileContext);

      const messages: Message[] = [
        {
          role: 'system',
          content: `أنت MuayadGen - مساعد برمجة ذكي ومحاور من تطوير Dr. Muayad.

${contextMessage}

## 🎯 افهم الطلب أولاً:

### إذا كان طلب كود واضح:
الكلمات المفتاحية: "اصنع"، "اكتب"، "أنشئ"، "طوّر"، "عدّل" + ملف/دالة/API/كود
👉 اكتب الكود مباشرة:
\`\`\`filename:اسم_الملف.ext
// الكود
\`\`\`

### إذا كان سؤال أو حوار:
سؤال عنك، أو طلب شرح، أو غير واضح
👉 أجب بشكل طبيعي ومفيد

## 💡 أمثلة:
- "اصنع API" → كود
- "اشرح لي API" → شرح بدون كود
- "من أنت؟" → تعريف
- "muayad" → اسأل للتوضيح

## ✅ قدراتك:
- كتابة أكواد احترافية
- المحادثة والشرح
- حل المشاكل البرمجية
- تقديم النصائح

## 🚀 كن ذكياً في فهم المطلوب!`
        },
        {
          role: 'user',
          content: prompt
        }
      ];

      return await this.sendChatMessage(messages);
    } catch (error: any) {
      console.error(chalk.red('❌ خطأ في توليد الكود:'), error.message);
      return {
        success: false,
        message: '',
        error: error.message
      };
    }
  }

  // بناء رسالة السياق من الملفات
  private buildContextMessage(fileContext: { path: string; content: string }[]): string {
    if (fileContext.length === 0) {
      return '📂 **السياق**: مشروع جديد بدون ملفات موجودة.';
    }

    let context = '📂 **الملفات الموجودة في المشروع**:\n\n';

    for (const file of fileContext) {
      context += `### 📄 ${file.path}\n`;
      context += '```\n';
      // حد أقصى 3000 حرف لكل ملف لتوفير tokens
      const maxLength = 3000;
      context += file.content.substring(0, maxLength);
      if (file.content.length > maxLength) {
        context += '\n... (الملف أطول - تم اختصاره)';
      }
      context += '\n```\n\n';
    }

    return context;
  }

  // التحقق من صحة API Key
  async verifyApiKey(): Promise<boolean> {
    try {
      // اختبار بسيط للتحقق من صحة المفتاح
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}

// إنشاء عميل Claude محلي من متغيرات البيئة
export function createLocalClaudeClient(): LocalClaudeClient | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log(chalk.yellow('⚠️  ANTHROPIC_API_KEY غير موجود في متغيرات البيئة'));
    console.log(chalk.cyan('أضف المفتاح في ملف .env:'));
    console.log(chalk.gray('ANTHROPIC_API_KEY=sk-ant-...'));
    return null;
  }

  return new LocalClaudeClient(apiKey);
}
