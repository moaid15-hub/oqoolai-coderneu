# 🧠 Oqool CLI

<div dir="rtl">

أداة ذكاء اصطناعي متقدمة لتوليد وتعديل الأكواد - سطر الأوامر

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

</div>

---

## ⚡ التثبيت السريع

```bash
# من داخل monorepo
npm install
npm run build:cli

# أو محلياً
npm install -g @oqool/cli
```

## 🚀 الاستخدام

### الأوامر الأساسية

```bash
# الأمر الرئيسي
oqool "اكتب كود React مع useState"

# توليد سريع
og "اكتب دالة JavaScript"

# مراجعة الكود  
ogr path/to/file.js

# اختبار الكود
ogt "اكتب اختبارات للدالة"

# توليد متقدم
ogg "اكتب تطبيق كامل"
```

### ✨ المميزات المتقدمة

#### 🏆 الذكاء الاصطناعي المتقدم
- **فرق AI متعددة الشخصيات**: 8 شخصيات متخصصة
- **ذكاء جماعي**: اتخاذ قرارات مع 5 خبراء
- **DNA الكود**: استخراج "البصمة الوراثية" للكود
- **نظام صوتي**: تفاعل صوتي بالعربية والإنجليزية

#### 🤖 الذكاء الاصطناعي المحسن
- **ذكاء متعدد**: دعم OpenAI, Claude, DeepSeek
- **توثيق تلقائي**: حفظ جميع التفاعلات
- **بحث ذكي**: البحث في تاريخ الردود
- **تعلم مخصص**: فهم أسلوبك وتفضيلاتك

### 📝 كتابة وتعديل متقدم
- **كتابة تلقائية**: إنشاء الملفات مباشرة
- **فهم السياق**: قراءة وفهم بنية المشروع  
- **محادثة تفاعلية**: وضع chat للتفاعل المستمر
- **Patch System**: تعديلات دقيقة على مستوى السطر

## 🔧 التطوير

```bash
# تطوير محلي
npm run dev

# بناء
npm run build

# اختبار
npm run test
```

## 📚 الملفات المهمة

- `src/cli.ts` - النقطة الرئيسية للـ CLI
- `src/tools.ts` - الأدوات الأساسية
- `bin/` - ملفات الأوامر القابلة للتنفيذ
- `tests/` - اختبارات الوحدة

## 🔗 المكتبات المشتركة

يستخدم CLI المكتبات المشتركة من `@oqool/shared`:

```typescript
import { AIGateway } from '@oqool/shared/ai-gateway';
import { Logger, formatCode } from '@oqool/shared/utils';
```

## 🌍 دعم اللغات

- **7 لغات برمجة**: JavaScript, TypeScript, Python, Go, Rust, Ruby, PHP
- **تنسيق تلقائي**: دعم جميع أدوات التنسيق الشائعة
- **فحص متقدم**: ESLint, Pylint, golangci-lint, clippy

---

**جزء من OqoolAI Monorepo** - منافس قوي لـ Cursor و Windsurf 🚀