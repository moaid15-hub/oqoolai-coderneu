// architect-agent.ts
// ============================================
// 🏗️ Architect Agent - المصمم المعماري
// ============================================

import Anthropic from '@anthropic-ai/sdk';
import type { Architecture, Component, DatabaseDesign, APIDesign, FrontendDesign } from '../god-mode.js';

export class ArchitectAgent {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string = 'claude-sonnet-4-20250514') {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async design(task: string): Promise<Architecture> {
    const prompt = `
Design a complete architecture for: ${task}

Include:
1. Frontend framework and structure
2. Backend API design
3. Database schema
4. Authentication system
5. Deployment strategy
6. File structure
7. Key components and their responsibilities

Output as structured JSON with these keys:
- components: array of {name, type, description, dependencies}
- database: {type, tables}
- api: {endpoints, authentication}
- frontend: {framework, components}
- tags: array of relevant tags

Be specific and detailed.
    `;

    const response = await this.callClaude(prompt);

    return {
      components: this.extractComponents(response),
      database: this.extractDatabase(response),
      api: this.extractAPI(response),
      frontend: this.extractFrontend(response),
      tags: this.extractTags(task)
    };
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

  private extractComponents(response: string): Component[] {
    try {
      const json = this.parseJSON(response);
      if (json.components && Array.isArray(json.components)) {
        return json.components;
      }
    } catch (e) {
      // fallback
    }

    // Extract from text
    const components: Component[] = [];
    const lines = response.split('\n');

    for (const line of lines) {
      if (line.match(/component|module|service/i)) {
        components.push({
          name: line.trim(),
          type: 'component',
          description: 'Auto-extracted component',
          dependencies: []
        });
      }
    }

    return components.length > 0 ? components : [
      {
        name: 'Main',
        type: 'core',
        description: 'Main application component',
        dependencies: []
      }
    ];
  }

  private extractDatabase(response: string): DatabaseDesign | undefined {
    try {
      const json = this.parseJSON(response);
      if (json.database) {
        return json.database;
      }
    } catch (e) {
      // ignore
    }

    // Check if database mentioned
    if (response.match(/database|sql|nosql|mongodb|postgres/i)) {
      return {
        type: 'PostgreSQL',
        tables: []
      };
    }

    return undefined;
  }

  private extractAPI(response: string): APIDesign | undefined {
    try {
      const json = this.parseJSON(response);
      if (json.api) {
        return json.api;
      }
    } catch (e) {
      // ignore
    }

    // Check if API mentioned
    if (response.match(/api|endpoint|rest|graphql/i)) {
      return {
        endpoints: [],
        authentication: 'JWT'
      };
    }

    return undefined;
  }

  private extractFrontend(response: string): FrontendDesign | undefined {
    try {
      const json = this.parseJSON(response);
      if (json.frontend) {
        return json.frontend;
      }
    } catch (e) {
      // ignore
    }

    // Detect framework
    const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js'];
    for (const framework of frameworks) {
      if (response.includes(framework)) {
        return {
          framework,
          components: []
        };
      }
    }

    return undefined;
  }

  private extractTags(task: string): string[] {
    const tags: string[] = [];
    const keywords = [
      'saas', 'platform', 'api', 'web', 'mobile',
      'dashboard', 'auth', 'payment', 'analytics'
    ];

    for (const keyword of keywords) {
      if (task.toLowerCase().includes(keyword)) {
        tags.push(keyword);
      }
    }

    return tags.length > 0 ? tags : ['project'];
  }

  private parseJSON(text: string): any {
    // Try to find JSON in the text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return {};
  }
}
