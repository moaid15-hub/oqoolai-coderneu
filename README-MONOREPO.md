# 🧠 OqoolAI Monorepo

<div dir="rtl">

منظومة متكاملة للذكاء الاصطناعي في البرمجة - مجموعة من الأدوات المتقدمة لتطوير البرمجيات

![Version](https://img.shields.io/badge/version-5.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Workspace](https://img.shields.io/badge/workspace-monorepo-purple.svg)

</div>

## 📋 هيكل المشروع

```
oqoolai-monorepo/
├── packages/
│   ├── cli/                    # أداة سطر الأوامر
│   ├── cloud-editor/           # المحرر السحابي
│   │   ├── frontend/          # واجهة React
│   │   └── backend/           # خادم Express
│   └── shared/                # مكتبات مشتركة
│       ├── ai-gateway/        # بوابة الذكاء الاصطناعي
│       └── utils/            # أدوات مساعدة
├── docs/                      # توثيق
├── scripts/                   # سكريبتات البناء
└── package.json              # Root workspace
```

## 🚀 البدء السريع

### التثبيت
```bash
# تثبيت جميع التبعيات
npm install

# بناء جميع الحزم
npm run build

# تشغيل وضع التطوير
npm run dev
```

### تشغيل أجزاء محددة

```bash
# CLI فقط
npm run dev:cli

# Cloud Editor فقط  
npm run dev:cloud

# بناء CLI فقط
npm run build:cli
```

## 📦 الحزم

### 🖥️ CLI Package (`@oqool/cli`)
أداة سطر الأوامر الأساسية للذكاء الاصطناعي في البرمجة

**الأوامر:**
- `oqool` - الأمر الرئيسي
- `og` - توليد سريع  
- `ogr` - مراجعة الكود
- `ogt` - اختبار الكود

### ☁️ Cloud Editor (`@oqool/cloud-editor`)
محرر سحابي متقدم مع ذكاء اصطناعي متكامل

**المميزات:**
- محرر Monaco مدمج
- طرفية مدمجة  
- شجرة الملفات
- اتصال مباشر مع AI

### 🔧 Shared Libraries (`@oqool/shared`)
مكتبات مشتركة للذكاء الاصطناعي والأدوات

**المكونات:**
- `ai-gateway` - بوابة موحدة لمزودي AI
- `utils` - أدوات مساعدة مشتركة

## 🛠️ التطوير

### إضافة ميزة جديدة
1. اختر الحزمة المناسبة في `packages/`
2. أضف الكود الجديد
3. استخدم المكتبات المشتركة عند الحاجة
4. اختبر باستخدام `npm run dev`

### إنشاء حزمة جديدة
```bash
mkdir packages/new-package
cd packages/new-package
npm init
# إضافة للـ workspaces في package.json الرئيسي
```

## 📜 Scripts المتاحة

| Script | الوصف |
|--------|--------|
| `npm run build` | بناء جميع الحزم |
| `npm run dev` | تشغيل جميع الحزم في وضع التطوير |  
| `npm run test` | تشغيل الاختبارات |
| `./scripts/build-all.sh` | بناء متتالي للحزم |
| `./scripts/dev-all.sh` | تطوير متزامن للجميع |

## 🔄 Workflow

1. **التطوير المحلي**: `npm run dev`
2. **البناء**: `npm run build` 
3. **النشر**: كل حزمة لها دورة نشر منفصلة
4. **التكامل**: استخدام المكتبات المشتركة

## 📚 المزيد

- [CLI Documentation](packages/cli/README.md)
- [Cloud Editor Guide](packages/cloud-editor/README.md)
- [API Reference](docs/api.md)

---

**OqoolAI Team** - منافس قوي لـ Cursor و Windsurf 🚀