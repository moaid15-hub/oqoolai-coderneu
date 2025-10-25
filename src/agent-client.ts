// agent-client.ts
// ============================================
// 🤖 Agent Loop - المحرك الحقيقي
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import { TOOL_DEFINITIONS, executeTool } from './tools.js';
import { ContextManager } from './context-manager.js';
import { IntelligentPlanner } from './planner.js';
import chalk from 'chalk';

export interface AgentConfig {
  apiKey: string;
  model?: string;
  maxIterations?: number;
  workingDirectory?: string;
  enablePlanning?: boolean; // تفعيل التخطيط الذكي
  enableContext?: boolean; // تفعيل Context Management
}

export class AgentClient {
  private client: Anthropic;
  private config: AgentConfig;
  private conversationHistory: Array<any> = [];
  private contextManager?: ContextManager;
  private planner?: IntelligentPlanner;

  constructor(config: AgentConfig) {
    this.config = {
      model: 'claude-sonnet-4-20250514',
      maxIterations: 25,
      workingDirectory: process.cwd(),
      enablePlanning: true,
      enableContext: true,
      ...config
    };

    this.client = new Anthropic({
      apiKey: this.config.apiKey
    });

    // تهيئة Context Manager
    if (this.config.enableContext) {
      this.contextManager = new ContextManager(this.config.workingDirectory!);
    }

    // تهيئة Planner
    if (this.config.enablePlanning) {
      this.planner = new IntelligentPlanner(this.config.apiKey);
    }
  }
  
  // ============================================
  // 🎯 الطريقة الرئيسية - تشغيل Agent
  // ============================================
  async run(userMessage: string): Promise<string> {
    console.log(chalk.cyan('\n🧠 MuayadGen يعمل الآن...'));
    console.log(chalk.gray('━'.repeat(40)));

    // 1. تحليل context المشروع
    let projectContext = '';
    if (this.contextManager) {
      try {
        projectContext = await this.contextManager.generateProjectSummary();
        console.log(chalk.gray('📊 تم تحليل سياق المشروع'));
      } catch (error) {
        console.log(chalk.yellow('⚠️ تعذر تحليل المشروع، المتابعة بدونه'));
      }
    }

    // 2. إنشاء خطة ذكية (للمهام المعقدة)
    if (this.planner && this.shouldPlan(userMessage)) {
      await this.planner.createPlan(userMessage, projectContext);
    }

    // إضافة رسالة المستخدم
    this.conversationHistory.push({
      role: 'user',
      content: userMessage
    });

    let iteration = 0;
    let finalResponse = '';

    while (iteration < this.config.maxIterations!) {
      iteration++;

      console.log(chalk.blue(`\n[Iteration ${iteration}]`));

      try {
        // استدعاء Claude API
        const response = await this.client.messages.create({
          model: this.config.model!,
          max_tokens: 4096,
          system: this.getSystemPrompt(projectContext),
          messages: this.conversationHistory,
          tools: TOOL_DEFINITIONS as any
        });

        // معالجة الرد
        const result = await this.processResponse(response);

        if (result.done) {
          finalResponse = result.text;
          break;
        }

      } catch (error: any) {
        console.error(chalk.red(`\n❌ خطأ: ${error.message}`));
        return `حدث خطأ: ${error.message}`;
      }
    }

    console.log(chalk.gray('\n' + '━'.repeat(40)));
    console.log(chalk.green('✅ انتهى MuayadGen من العمل!\n'));

    // عرض ملخص الخطة إذا كان هناك واحدة
    if (this.planner) {
      const summary = this.planner.getSummary();
      if (summary !== 'لا توجد خطة حالية') {
        console.log(chalk.cyan(summary));
      }
    }

    return finalResponse;
  }

  // ============================================
  // 🤔 تحديد إذا كانت المهمة تحتاج تخطيط
  // ============================================
  private shouldPlan(message: string): boolean {
    const keywords = [
      'أضف', 'اصنع', 'طور', 'حسّن', 'غير', 'عدل',
      'add', 'create', 'build', 'develop', 'refactor'
    ];

    return keywords.some(kw => message.toLowerCase().includes(kw.toLowerCase()));
  }
  
  // ============================================
  // 📝 System Prompt
  // ============================================
  private getSystemPrompt(projectContext: string = ''): string {
    let prompt = `أنت MuayadGen - مساعد برمجة ذكي من تطوير Dr. Muayad.

🎯 مهمتك:
- قراءة وفهم المشاريع البرمجية
- كتابة وتعديل الأكواد بذكاء
- تنفيذ الأوامر
- حل المشاكل البرمجية بطريقة احترافية

🛠️ الأدوات المتاحة:
- read_file: قراءة ملف
- write_file: كتابة ملف
- list_directory: استعراض مجلد
- edit_file: تعديل ملف
- execute_command: تنفيذ أمر
- search_in_files: البحث في الملفات

📂 مجلد العمل الحالي: ${this.config.workingDirectory}`;

    // إضافة معلومات المشروع إذا كانت متوفرة
    if (projectContext) {
      prompt += `\n\n${projectContext}`;
    }

    prompt += `

🎨 أسلوب العمل:
1. افهم طلب المستخدم جيداً
2. خطط للمهمة قبل التنفيذ
3. استخدم الأدوات لقراءة/فهم المشروع
4. نفذ المطلوب بدقة ومهنية
5. اشرح ما فعلته بوضوح

⚠️ قواعد مهمة:
- استخدم الأدوات فعلياً - لا تخمن!
- اقرأ الملفات قبل التعديل
- تأكد من صحة المسارات والأسماء
- اشرح كل خطوة بوضوح
- إذا واجهت خطأ، حاول حله بذكاء
- احترم بنية المشروع الحالية
- اتبع best practices للغة البرمجة المستخدمة

عند الانتهاء من المهمة، قدم ملخص واضح ومفصل لما تم إنجازه.`;

    return prompt;
  }
  
  // ============================================
  // ⚙️ معالجة رد Claude
  // ============================================
  private async processResponse(response: any): Promise<{
    done: boolean;
    text: string;
  }> {
    // إضافة رد Assistant للتاريخ
    this.conversationHistory.push({
      role: 'assistant',
      content: response.content
    });
    
    // التحقق من stop_reason
    if (response.stop_reason === 'end_turn') {
      // انتهى Agent - استخراج النص
      const textBlocks = response.content.filter(
        (block: any) => block.type === 'text'
      );
      
      const finalText = textBlocks
        .map((block: any) => block.text)
        .join('\n');
      
      return {
        done: true,
        text: finalText
      };
    }
    
    // استخراج tool uses
    const toolUses = response.content.filter(
      (block: any) => block.type === 'tool_use'
    );
    
    if (toolUses.length === 0) {
      return {
        done: true,
        text: 'انتهى العمل بدون استخدام أدوات'
      };
    }
    
    // تنفيذ الأدوات
    const toolResults = await Promise.all(
      toolUses.map(async (toolUse: any) => {
        console.log(chalk.yellow(`\n🔧 استخدام أداة: ${toolUse.name}`));
        console.log(chalk.gray(JSON.stringify(toolUse.input, null, 2)));
        
        const result = await executeTool(toolUse.name, toolUse.input);
        
        // عرض نتيجة مختصرة
        try {
          const parsed = JSON.parse(result);
          if (parsed.success) {
            console.log(chalk.green('✓ نجحت'));
          } else {
            console.log(chalk.red(`✗ فشلت: ${parsed.error}`));
          }
        } catch (e) {
          console.log(chalk.gray('نتيجة: ' + result.slice(0, 100)));
        }
        
        return {
          type: 'tool_result',
          tool_use_id: toolUse.id,
          content: result
        };
      })
    );
    
    // إضافة نتائج الأدوات للتاريخ
    this.conversationHistory.push({
      role: 'user',
      content: toolResults
    });
    
    return {
      done: false,
      text: ''
    };
  }
  
  // ============================================
  // 💬 وضع المحادثة التفاعلية
  // ============================================
  async chat(message: string): Promise<string> {
    return await this.run(message);
  }

  // ============================================
  // ✅ التحقق من صحة API Key
  // ============================================
  async verifyApiKey(): Promise<boolean> {
    try {
      await this.client.messages.create({
        model: this.config.model!,
        max_tokens: 1,
        messages: [{ role: 'user', content: 'test' }]
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // ============================================
  // 🔄 إعادة تعيين المحادثة
  // ============================================
  resetConversation(): void {
    this.conversationHistory = [];
  }
  
  // ============================================
  // 📊 إحصائيات
  // ============================================
  getStats(): {
    messagesCount: number;
    iterations: number;
  } {
    return {
      messagesCount: this.conversationHistory.length,
      iterations: this.conversationHistory.filter(
        msg => msg.role === 'assistant'
      ).length
    };
  }
}

// ============================================
// 🏭 Factory Function
// ============================================
export function createAgentClient(config: AgentConfig): AgentClient {
  return new AgentClient(config);
}
