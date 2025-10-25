// cli-new-commands.ts
// الأوامر الجديدة للأنظمة الثلاثة

import { Command } from 'commander';
import chalk from 'chalk';
import { createClientFromConfig } from './api-client.js';
import { createFileManager } from './file-manager.js';
import { ui } from './ui.js';
import { createAICodeCompletion } from './ai-code-completion.js';
import { createDatabaseIntegration } from './database-integration.js';
import { createAPITesting } from './api-testing.js';

export function registerNewCommands(program: Command): void {

// ========================================
// أوامر AI Code Completion
// ========================================

program
  .command('complete <prompt>')
  .description('إكمال كود ذكي باستخدام AI')
  .option('-l, --language <lang>', 'اللغة', 'typescript')
  .option('-n, --suggestions <number>', 'عدد الاقتراحات', '5')
  .action(async (prompt: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const completion = createAICodeCompletion(process.cwd(), client);
      ui.startSpinner('توليد اقتراحات...');
      const result = await completion.completeCode(prompt, {
        language: options.language,
        maxSuggestions: parseInt(options.suggestions)
      });
      if (result.success) {
        ui.succeedSpinner('تم التوليد!');
        result.suggestions.forEach((s, i) => {
          console.log(chalk.yellow(`\n${i + 1}. ${s.description}`));
          console.log(chalk.cyan('```'));
          console.log(s.code);
          console.log(chalk.cyan('```'));
        });
      }
    } catch (error: any) {
      ui.failSpinner('خطأ');
      console.error(chalk.red(error.message));
    }
  });

program
  .command('complete-function <comment>')
  .description('توليد دالة من تعليق')
  .option('-n, --name <name>', 'اسم الدالة')
  .action(async (comment: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const completion = createAICodeCompletion(process.cwd(), client);
      ui.startSpinner('توليد الدالة...');
      const result = await completion.completeFunctionFromComment(comment, options.name);
      if (result.success) {
        ui.succeedSpinner('تم!');
        console.log(chalk.cyan('```'));
        console.log(result.suggestions[0]?.code);
        console.log(chalk.cyan('```'));
      }
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('improve <file>')
  .description('اقتراح تحسينات')
  .action(async (file: string) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const completion = createAICodeCompletion(process.cwd(), client);
      const fileManager = createFileManager();
      const code = await fileManager.readFile(file);
      if (!code) return;
      ui.startSpinner('تحليل...');
      const result = await completion.suggestImprovements(code);
      if (result.success) {
        ui.succeedSpinner('تم!');
        result.suggestions.forEach((s, i) => {
          console.log(chalk.yellow(`\n${i + 1}. ${s.description}`));
        });
      }
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

// ========================================
// أوامر Database
// ========================================

program
  .command('db-init <type>')
  .description('تهيئة قاعدة بيانات')
  .option('--orm <orm>', 'ORM')
  .action(async (type: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const db = createDatabaseIntegration(process.cwd(), client);
      await db.initializeDatabase(type as any, options.orm);
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('db-schema <description>')
  .description('توليد schema')
  .option('--orm <orm>', 'ORM', 'none')
  .action(async (description: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const db = createDatabaseIntegration(process.cwd(), client);
      ui.startSpinner('توليد Schema...');
      const tables = await db.generateSchemaFromDescription(description, { ormType: options.orm });
      ui.succeedSpinner('تم!');
      console.log(chalk.green(`\n✅ ${tables.length} جدول`));
      await db.generateSchemaFiles(tables, options.orm);
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('db-migration <name>')
  .description('إنشاء migration')
  .action(async (name: string) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const db = createDatabaseIntegration(process.cwd(), client);
      await db.createMigration(name);
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('db-query <description>')
  .description('توليد SQL query')
  .action(async (description: string) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const db = createDatabaseIntegration(process.cwd(), client);
      ui.startSpinner('توليد...');
      const query = await db.generateQueryFromNaturalLanguage(description);
      ui.succeedSpinner('تم!');
      console.log(chalk.cyan('\n```sql'));
      console.log(query);
      console.log(chalk.cyan('```\n'));
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

// ========================================
// أوامر API Testing
// ========================================

program
  .command('api-test-create <name>')
  .description('إنشاء test suite')
  .option('-u, --base-url <url>', 'Base URL')
  .action(async (name: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const apiTest = createAPITesting(process.cwd(), client);
      await apiTest.createTestSuite(name, undefined, options.baseUrl);
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('api-load-test <url>')
  .description('Load testing')
  .option('-d, --duration <sec>', 'المدة', '30')
  .option('-c, --concurrency <num>', 'التزامن', '10')
  .action(async (url: string, options: any) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const apiTest = createAPITesting(process.cwd(), client);
      await apiTest.runLoadTest({
        endpoint: { name: 'Test', method: 'GET', url },
        duration: parseInt(options.duration),
        concurrency: parseInt(options.concurrency)
      });
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

program
  .command('api-from-openapi <spec>')
  .description('توليد tests من OpenAPI')
  .action(async (spec: string) => {
    try {
      const client = await createClientFromConfig();
      if (!client) return;
      const apiTest = createAPITesting(process.cwd(), client);
      ui.startSpinner('توليد...');
      const suite = await apiTest.generateTestSuiteFromOpenAPI(spec, 'API Tests');
      ui.succeedSpinner('تم!');
      console.log(chalk.green(`\n✅ ${suite.testCases.length} tests\n`));
    } catch (error: any) {
      console.error(chalk.red(error.message));
    }
  });

}
