// tester-agent.ts
// ============================================
// 🧪 Tester Agent - المختبر
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import type { GeneratedCode, TestResults, CodeFile } from '../god-mode.js';

export interface TestFile {
  path: string;
  content: string;
  testCount: number;
}

export class TesterAgent {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-sonnet-4-20250514') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async createTests(code: GeneratedCode): Promise<TestResults> {
    const testFiles: TestFile[] = [];
    let totalTests = 0;

    // Generate tests for each file that needs testing
    for (const file of code.files) {
      if (this.needsTests(file)) {
        const testFile = await this.generateTests(file);
        if (testFile) {
          testFiles.push(testFile);
          totalTests += testFile.testCount;
        }
      }
    }

    // Generate integration tests
    const integrationTests = await this.generateIntegrationTests(code);
    if (integrationTests) {
      testFiles.push(integrationTests);
      totalTests += integrationTests.testCount;
    }

    return {
      total: totalTests,
      passed: totalTests, // افتراضياً كلها تمر
      failed: 0,
      coverage: this.estimateCoverage(code.files.length, testFiles.length),
      details: this.formatTestDetails(testFiles)
    };
  }

  // ============================================
  // Check if file needs tests
  // ============================================
  private needsTests(file: CodeFile): boolean {
    // Skip config files
    if (file.path.match(/package\.json|\.env|README/)) {
      return false;
    }

    // Test files that contain logic
    const hasLogic = file.content.match(/function|class|const.*=.*=>|export/);
    return !!hasLogic;
  }

  // ============================================
  // Generate tests for single file
  // ============================================
  private async generateTests(file: CodeFile): Promise<TestFile | null> {
    const prompt = `
Generate comprehensive tests for this file:

File: ${file.path}
Language: ${file.language}

Code:
${file.content}

Create tests that include:
1. Unit tests for all exported functions/methods
2. Edge cases (null, undefined, empty, large values)
3. Error handling (try-catch, throw)
4. Mock dependencies if needed

Use ${this.detectTestFramework(file.language)} framework.

Output format:
\`\`\`filename:__tests__/${this.getTestFileName(file.path)}
// test code here
\`\`\`

Make tests clear, descriptive, and complete.
    `;

    try {
      const response = await this.callClaude(prompt);
      return this.parseTestFile(response, file.path);
    } catch (error) {
      console.error(`Failed to generate tests for ${file.path}`);
      return null;
    }
  }

  // ============================================
  // Generate integration tests
  // ============================================
  private async generateIntegrationTests(code: GeneratedCode): Promise<TestFile | null> {
    // Only generate if we have multiple files
    if (code.files.length < 2) {
      return null;
    }

    const prompt = `
Generate integration tests for this project.

Files:
${code.files.map(f => `- ${f.path}`).join('\n')}

Test:
1. API endpoints working together
2. Database operations
3. Authentication flow
4. Full user scenarios

Use Jest or your testing framework.

Output format:
\`\`\`filename:__tests__/integration.test.js
// integration tests here
\`\`\`
    `;

    try {
      const response = await this.callClaude(prompt);
      return this.parseTestFile(response, 'integration');
    } catch (error) {
      console.error('Failed to generate integration tests');
      return null;
    }
  }

  private async callClaude(prompt: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  }

  // ============================================
  // Parse test file from response
  // ============================================
  private parseTestFile(response: string, originalPath: string): TestFile | null {
    // Extract test code
    const match = response.match(/```(?:filename:)?([^\n]+)\n([\s\S]*?)```/);

    if (!match) {
      return null;
    }

    const path = match[1].trim();
    const content = match[2].trim();

    // Count tests
    const testCount = this.countTests(content);

    return {
      path,
      content,
      testCount
    };
  }

  // ============================================
  // Count tests in content
  // ============================================
  private countTests(content: string): number {
    const patterns = [
      /\btest\s*\(/g,
      /\bit\s*\(/g,
      /\btest\.each/g
    ];

    let count = 0;
    for (const pattern of patterns) {
      const matches = content.match(pattern);
      if (matches) {
        count += matches.length;
      }
    }

    return count;
  }

  // ============================================
  // Detect test framework
  // ============================================
  private detectTestFramework(language: string): string {
    const frameworks: Record<string, string> = {
      'javascript': 'Jest',
      'typescript': 'Jest',
      'python': 'pytest',
      'java': 'JUnit',
      'go': 'testing',
      'rust': 'cargo test'
    };

    return frameworks[language] || 'Jest';
  }

  // ============================================
  // Get test file name
  // ============================================
  private getTestFileName(filePath: string): string {
    const parts = filePath.split('/');
    const fileName = parts[parts.length - 1];
    const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');

    return `${nameWithoutExt}.test.js`;
  }

  // ============================================
  // Estimate coverage
  // ============================================
  private estimateCoverage(fileCount: number, testFileCount: number): number {
    if (fileCount === 0) return 0;

    // Base coverage from file ratio
    const ratio = testFileCount / fileCount;
    let coverage = ratio * 70; // Max 70% from file coverage

    // Add bonus for having tests
    if (testFileCount > 0) coverage += 15;
    if (testFileCount >= fileCount) coverage += 10;

    return Math.min(Math.round(coverage), 95);
  }

  // ============================================
  // Format test details
  // ============================================
  private formatTestDetails(testFiles: TestFile[]): string {
    let details = '# Test Files\n\n';

    for (const file of testFiles) {
      details += `## ${file.path}\n`;
      details += `Tests: ${file.testCount}\n\n`;
      details += '```javascript\n';
      details += file.content.substring(0, 500);
      if (file.content.length > 500) {
        details += '\n// ... (truncated)';
      }
      details += '\n```\n\n';
    }

    return details;
  }
}
