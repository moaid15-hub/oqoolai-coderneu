// agent-claude-client.ts
// ============================================
// 🤖 MuayadGen Agent - مساعد برمجة كامل مثل Claude Code
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import chalk from 'chalk';
import { Message, ChatResponse } from './api-client.js';
import { toolDefinitions, executeTool } from './tools.js';

export class AgentClaudeClient {
  private client: Anthropic;
  private apiKey: string;
  private workingDirectory: string;

  constructor(apiKey: string, workingDirectory: string = process.cwd()) {
    this.apiKey = apiKey;
    this.workingDirectory = workingDirectory;
    this.client = new Anthropic({
      apiKey: this.apiKey,
    });
  }

  // System Prompt القوي للـ Agent
  private getSystemPrompt(): string {
    return `أنت MuayadGen - مساعد برمجة متقدم ومطور ذكي من تطوير Dr. Muayad.

## 🎯 قدراتك الكاملة:

أنت لست مجرد مولد كود - أنت **Coding Agent كامل** مثل أفضل الأدوات البرمجية!

### ✅ يمكنك:
1. **قراءة الملفات**: استخدم read_file لقراءة أي ملف في المشروع
2. **كتابة ملفات جديدة**: استخدم write_file لإنشاء ملفات
3. **تعديل ملفات موجودة**: استخدم edit_file لتعديل أجزاء محددة
4. **تنفيذ أوامر**: استخدم run_command لتنفيذ npm, git, build, etc.
5. **تحليل المشاريع**: استخدم list_directory و search_in_files لفهم البنية
6. **العمل بذكاء**: اقرأ الكود، افهمه، ثم عدّل بدقة

### 🚀 سير العمل:

**عند طلب تعديل أو إضافة ميزة:**
1. اقرأ الملفات المتعلقة أولاً (read_file)
2. افهم البنية والكود الموجود
3. خطط للتعديلات
4. نفّذ التعديلات (edit_file أو write_file)
5. اختبر إذا لزم الأمر (run_command)

**عند طلب إنشاء ملف جديد:**
1. تحقق من المجلد (list_directory)
2. اكتب الملف مباشرة (write_file)

**عند طلب إصلاح خطأ:**
1. اقرأ الملف المتأثر
2. حلل المشكلة
3. عدّل الكود بدقة

### 💪 قواعد مهمة:

✅ **افعل:**
- استخدم الأدوات بشكل فعال
- اقرأ قبل أن تعدل
- كن دقيقاً في التعديلات
- اشرح ما تفعله بوضوح

❌ **لا تفعل:**
- لا تعتذر أو تتردد
- لا تقل "لا أستطيع الوصول للملفات" - يمكنك!
- لا تولد كود نصي إذا كان يجب عليك التعديل مباشرة
- لا تنسَ استخدام الأدوات المتاحة

### 📍 المسار الحالي:
${this.workingDirectory}

## 🎨 التنسيق:

عند الانتهاء من مهمة، اشرح ما فعلته بوضوح:
- ✅ "قرأت الملف X"
- ✅ "عدلت السطر Y في الملف Z"
- ✅ "أنشأت ملف جديد A"
- ✅ "نفذت الأمر B"

أنت أداة قوية - استخدم قدراتك الكاملة! 🚀`;
  }

  // Agent Loop - الحلقة الرئيسية للعمل
  async runAgent(userPrompt: string): Promise<ChatResponse> {
    try {
      console.log(chalk.cyan('🧠 MuayadGen يعمل الآن...'));
      console.log(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));

      const messages: any[] = [
        {
          role: 'user',
          content: userPrompt
        }
      ];

      let finalResponse = '';
      let continueLoop = true;
      let iterationCount = 0;
      const maxIterations = 15; // حماية من اللوب اللانهائي

      while (continueLoop && iterationCount < maxIterations) {
        iterationCount++;

        // إرسال الرسالة مع Tools
        const response = await this.client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          system: this.getSystemPrompt(),
          messages: messages,
          tools: toolDefinitions as any
        });

        console.log(chalk.gray(`\n[Iteration ${iterationCount}]`));

        // معالجة الرد
        let hasToolUse = false;
        const toolResults: any[] = [];

        for (const block of response.content) {
          if (block.type === 'text') {
            finalResponse = block.text;
            if (block.text.trim()) {
              console.log(chalk.white(block.text));
            }
          } else if (block.type === 'tool_use') {
            hasToolUse = true;

            console.log(chalk.yellow(`\n🔧 استخدام أداة: ${block.name}`));
            console.log(chalk.gray(JSON.stringify(block.input, null, 2)));

            // تنفيذ الأداة
            const toolResult = await executeTool(block.name, block.input);

            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(toolResult)
            });
          }
        }

        // إضافة رد Assistant للتاريخ
        messages.push({
          role: 'assistant',
          content: response.content
        });

        // إذا كان هناك نتائج أدوات، إضافتها
        if (toolResults.length > 0) {
          messages.push({
            role: 'user',
            content: toolResults
          });
        } else {
          // لا توجد أدوات - انتهى العمل
          continueLoop = false;
        }

        // التحقق من stop_reason
        if (response.stop_reason === 'end_turn') {
          continueLoop = false;
        }
      }

      console.log(chalk.gray('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
      console.log(chalk.green('✅ انتهى MuayadGen من العمل!\n'));

      return {
        success: true,
        message: finalResponse || 'تم إكمال المهمة بنجاح',
        usedProvider: 'muayadgen-agent'
      };

    } catch (error: any) {
      console.error(chalk.red('❌ خطأ في Agent:'), error.message);
      return {
        success: false,
        message: '',
        error: error.message
      };
    }
  }

  // وضع المحادثة التفاعلي مع Agent
  async chatWithAgent(messages: Message[]): Promise<ChatResponse> {
    try {
      // تحويل الرسائل لصيغة Claude
      const claudeMessages: any[] = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

      // Agent Loop للمحادثة
      let continueLoop = true;
      let iterationCount = 0;
      const maxIterations = 10;
      let finalResponse = '';

      while (continueLoop && iterationCount < maxIterations) {
        iterationCount++;

        const response = await this.client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 8192,
          system: this.getSystemPrompt(),
          messages: claudeMessages,
          tools: toolDefinitions as any
        });

        let hasToolUse = false;
        const toolResults: any[] = [];

        for (const block of response.content) {
          if (block.type === 'text') {
            finalResponse = block.text;
          } else if (block.type === 'tool_use') {
            hasToolUse = true;

            // تنفيذ الأداة بهدوء في وضع المحادثة
            const toolResult = await executeTool(block.name, block.input);

            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: JSON.stringify(toolResult)
            });
          }
        }

        // إضافة للتاريخ
        claudeMessages.push({
          role: 'assistant',
          content: response.content
        });

        if (toolResults.length > 0) {
          claudeMessages.push({
            role: 'user',
            content: toolResults
          });
        } else {
          continueLoop = false;
        }

        if (response.stop_reason === 'end_turn') {
          continueLoop = false;
        }
      }

      return {
        success: true,
        message: finalResponse,
        usedProvider: 'muayadgen-agent'
      };

    } catch (error: any) {
      console.error(chalk.red('❌ خطأ:'), error.message);
      return {
        success: false,
        message: '',
        error: error.message
      };
    }
  }

  // التحقق من صحة API Key
  async verifyApiKey(): Promise<boolean> {
    try {
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

// إنشاء Agent من متغيرات البيئة
export function createAgentClient(workingDir?: string): AgentClaudeClient | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.log(chalk.yellow('⚠️  ANTHROPIC_API_KEY غير موجود في متغيرات البيئة'));
    console.log(chalk.cyan('أضف المفتاح في ملف .env:'));
    console.log(chalk.gray('ANTHROPIC_API_KEY=sk-ant-...'));
    return null;
  }

  return new AgentClaudeClient(apiKey, workingDir || process.cwd());
}
