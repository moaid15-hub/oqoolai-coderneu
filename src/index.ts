// index.ts
// ============================================
// 🚀 نقطة الدخول الرئيسية
// ============================================

import { runCLI } from './cli.js';

// تشغيل CLI
runCLI();

// تصدير الوحدات للاستخدام البرمجي
export * from './auth.js';
export * from './api-client.js';
export * from './file-manager.js';
export * from './ui.js';
