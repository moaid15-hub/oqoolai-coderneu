# 🧠 دليل محلل الكود الذكي (AST Analyzer)

## 📖 المقدمة

محلل الكود الذكي في Oqool Code يستخدم **AST (Abstract Syntax Tree)** لفهم الكود بعمق قبل التعديل.

### ✅ ماذا يمكنه أن يفعل؟

- 🔍 **تحليل عميق** للكود JavaScript/TypeScript
- 📊 **استخراج معلومات** عن الدوال، المتغيرات، Classes
- 📥 **فهم العلاقات** بين الملفات (imports/exports)
- ⚠️ **كشف المشاكل** المحتملة في الكود
- 📈 **قياس التعقيد** (Complexity) للدوال
- 📝 **إحصائيات تفصيلية** عن الكود

---

## 🚀 الاستخدام السريع

### الأمر الأساسي:

\`\`\`bash
oqool-code analyze <file.js>
\`\`\`

### مع خيارات:

\`\`\`bash
# تحليل ملف واحد
oqool-code analyze src/app.js

# تحليل عدة ملفات
oqool-code analyze src/app.js src/utils.js src/api.js

# إخراج JSON
oqool-code analyze src/app.js --output json

# إخفاء المشاكل المحتملة
oqool-code analyze src/app.js --no-issues
\`\`\`

---

## 📊 ما يتم تحليله

### 1. **الدوال (Functions)**

يكتشف:
- ✅ Function declarations
- ✅ Arrow functions
- ✅ Class methods
- ✅ Async functions
- ✅ معاملات الدوال (parameters)
- ✅ موقع الدالة (line start/end)
- ✅ مستوى التعقيد (complexity)

**مثال:**
\`\`\`javascript
function greet(name) {  // ← يتم اكتشافه
  console.log(\`Hello \${name}\`);
}

const calculate = (a, b) => a + b;  // ← يتم اكتشافه

async function fetchData() {  // ← async function
  // ...
}
\`\`\`

**النتيجة:**
\`\`\`
⚡ الدوال (3):
  • greet(name) - السطر 1
  • calculate(a, b) - السطر 5
  • fetchData() [async] - السطر 7
\`\`\`

---

### 2. **المتغيرات (Variables)**

يكتشف:
- ✅ const declarations
- ✅ let declarations
- ✅ var declarations (مع تحذير!)
- ✅ موقع التعريف
- ✅ النطاق (scope)

**مثال:**
\`\`\`javascript
const API_URL = 'https://api.example.com';
let counter = 0;
var oldStyle = 'not recommended';  // ⚠️ تحذير
\`\`\`

**النتيجة:**
\`\`\`
📦 المتغيرات (3):
  • const: 1
  • let: 1
  • var: 1 ⚠️

⚠️ المشاكل المحتملة:
  ⚠️ استخدام var بدلاً من const/let - السطر 3
     💡 استبدل var oldStyle بـ const أو let
\`\`\`

---

### 3. **Imports**

يكتشف:
- ✅ Default imports
- ✅ Named imports
- ✅ Namespace imports
- ✅ المصادر (dependencies)

**مثال:**
\`\`\`javascript
import React from 'react';
import { useState, useEffect } from 'react';
import * as utils from './utils';
\`\`\`

**النتيجة:**
\`\`\`
📥 Imports (3):
  • react - [React]
  • react - [useState, useEffect]
  • ./utils - [utils]
\`\`\`

---

### 4. **Exports**

يكتشف:
- ✅ Named exports
- ✅ Default exports
- ✅ موقع Export

**مثال:**
\`\`\`javascript
export const API_KEY = 'xxx';
export function helper() { }
export default MyComponent;
\`\`\`

**النتيجة:**
\`\`\`
📤 Exports (3):
  • API_KEY
  • helper
  • MyComponent [default]
\`\`\`

---

### 5. **Classes**

يكتشف:
- ✅ Class declarations
- ✅ Methods
- ✅ Properties
- ✅ Inheritance (extends)

**مثال:**
\`\`\`javascript
class User extends Person {
  name = 'John';
  age = 30;

  greet() { }
  save() { }
}
\`\`\`

**النتيجة:**
\`\`\`
🏛️ Classes (1):
  • User extends Person
    - Methods: greet, save
\`\`\`

---

### 6. **الإحصائيات (Stats)**

- 📏 إجمالي الأسطر
- 💻 أسطر الكود الفعلية
- 💬 أسطر التعليقات
- ⬜ أسطر فارغة
- 🔢 التعقيد الكلي (Cyclomatic Complexity)

**مثال:**
\`\`\`
📊 الإحصائيات:
  • إجمالي الأسطر: 150
  • أسطر الكود: 110
  • أسطر التعليقات: 25
  • أسطر فارغة: 15
  • التعقيد الكلي: 18
\`\`\`

---

### 7. **المشاكل المحتملة (Issues)**

يكتشف:
- ⚠️ استخدام `var` بدلاً من `const/let`
- ℹ️ استخدام `console.log` (للحذف في production)
- ⚠️ دوال معقدة جداً (complexity > 10)
- ℹ️ دوال طويلة جداً (> 50 سطر)

**مثال:**
\`\`\`
⚠️ المشاكل المحتملة (3):
  ⚠️ استخدام var بدلاً من const/let - السطر 5
     💡 استبدل var count بـ const أو let

  ℹ️ تم العثور على 8 استدعاء لـ console.log
     💡 احذف console.log في production

  ⚠️ الدالة processData معقدة جداً (15) - السطر 42
     💡 قسم الدالة إلى دوال أصغر
\`\`\`

---

## 📝 أمثلة عملية

### مثال 1: تحليل ملف بسيط

**الملف: app.js**
\`\`\`javascript
import React from 'react';

const App = () => {
  return <div>Hello World</div>;
};

export default App;
\`\`\`

**الأمر:**
\`\`\`bash
oqool-code analyze app.js
\`\`\`

**النتيجة:**
\`\`\`
🔍 تحليل الملف: app.js
══════════════════════════════════════════════════════════════════════

📝 اللغة: JSX

📊 الإحصائيات:
  • إجمالي الأسطر: 7
  • أسطر الكود: 5
  • أسطر التعليقات: 0
  • أسطر فارغة: 2
  • التعقيد الكلي: 1

⚡ الدوال (1):
  • App() - السطر 3

📦 المتغيرات (1):
  • const: 1
  • let: 0

📥 Imports (1):
  • react - [React]

📤 Exports (1):
  • App [default]

══════════════════════════════════════════════════════════════════════
\`\`\`

---

### مثال 2: تحليل ملف معقد

**الملف: api.js**
\`\`\`javascript
import axios from 'axios';

var API_URL = 'https://api.example.com';  // ⚠️

export async function fetchUsers() {
  console.log('Fetching users...');  // ℹ️
  const response = await axios.get(\`\${API_URL}/users\`);
  return response.data;
}

export async function updateUser(id, data) {
  if (!id) {
    throw new Error('ID required');
  }
  if (!data) {
    throw new Error('Data required');
  }
  if (!data.name) {
    throw new Error('Name required');
  }
  if (!data.email) {
    throw new Error('Email required');
  }
  // ... المزيد من الشروط (دالة معقدة!)

  console.log(\`Updating user \${id}\`);
  return await axios.put(\`\${API_URL}/users/\${id}\`, data);
}
\`\`\`

**الأمر:**
\`\`\`bash
oqool-code analyze api.js
\`\`\`

**النتيجة:**
\`\`\`
🔍 تحليل الملف: api.js
══════════════════════════════════════════════════════════════════════

📝 اللغة: JAVASCRIPT

📊 الإحصائيات:
  • إجمالي الأسطر: 28
  • أسطر الكود: 22
  • أسطر التعليقات: 1
  • أسطر فارغة: 5
  • التعقيد الكلي: 12

⚡ الدوال (2):
  • fetchUsers() [async] - السطر 5
  • updateUser(id, data) [async] - السطر 11

📦 المتغيرات (2):
  • const: 1
  • let: 0
  • var: 1 ⚠️

📥 Imports (1):
  • axios - [axios]

📤 Exports (2):
  • fetchUsers
  • updateUser

⚠️ المشاكل المحتملة (3):
  ⚠️ استخدام var بدلاً من const/let - السطر 3
     💡 استبدل var API_URL بـ const أو let

  ℹ️ تم العثور على 2 استدعاء لـ console.log
     💡 احذف console.log في production

  ⚠️ الدالة updateUser معقدة جداً (11) - السطر 11
     💡 قسم الدالة إلى دوال أصغر

══════════════════════════════════════════════════════════════════════
\`\`\`

---

### مثال 3: إخراج JSON

**الأمر:**
\`\`\`bash
oqool-code analyze app.js --output json > analysis.json
\`\`\`

**النتيجة (analysis.json):**
\`\`\`json
{
  "filePath": "app.js",
  "language": "jsx",
  "functions": [
    {
      "name": "App",
      "type": "arrow",
      "params": [],
      "async": false,
      "lineStart": 3,
      "lineEnd": 5
    }
  ],
  "variables": [
    {
      "name": "App",
      "kind": "const",
      "lineNumber": 3,
      "scope": "Program"
    }
  ],
  "imports": [
    {
      "source": "react",
      "imported": ["React"],
      "type": "default",
      "lineNumber": 1
    }
  ],
  "exports": [
    {
      "name": "App",
      "type": "default",
      "lineNumber": 7
    }
  ],
  "classes": [],
  "stats": {
    "totalLines": 7,
    "codeLines": 5,
    "commentLines": 0,
    "blankLines": 2,
    "complexity": 1
  },
  "issues": [],
  "dependencies": ["react"]
}
\`\`\`

---

## 🎯 حالات الاستخدام

### 1. **قبل التعديل (Pre-modification Analysis)**

\`\`\`bash
# افهم الكود قبل تعديله
oqool-code analyze src/api.js

# ثم عدله بدقة
oqool-code patch "حسن دالة fetchUsers" --files src/api.js
\`\`\`

---

### 2. **Code Review**

\`\`\`bash
# راجع جودة الكود
oqool-code analyze src/**/*.js

# شوف المشاكل
# إصلح المشاكل المكتشفة
\`\`\`

---

### 3. **فهم مشروع جديد**

\`\`\`bash
# افهم بنية المشروع
oqool-code structure

# حلل الملفات الرئيسية
oqool-code analyze src/index.js src/App.js src/api.js
\`\`\`

---

### 4. **كشف Complexity**

\`\`\`bash
# شوف الدوال المعقدة
oqool-code analyze src/utils.js | grep "معقدة جداً"
\`\`\`

---

## 🔧 API للمطورين

\`\`\`typescript
import { createCodeAnalyzer } from '@oqool/code';

const analyzer = createCodeAnalyzer();

// تحليل ملف
const analysis = await analyzer.analyzeFile('src/app.js');

// عرض النتائج
analyzer.displayAnalysis(analysis);

// الوصول للبيانات
console.log('عدد الدوال:', analysis.functions.length);
console.log('التعقيد:', analysis.stats.complexity);
console.log('المشاكل:', analysis.issues);

// استخراج معلومات محددة
const asyncFunctions = analysis.functions.filter(f => f.async);
const varDeclarations = analysis.variables.filter(v => v.kind === 'var');
const externalDeps = analysis.dependencies.filter(d => !d.startsWith('.'));
\`\`\`

---

## 📚 اللغات المدعومة

- ✅ JavaScript (.js)
- ✅ TypeScript (.ts)
- ✅ JSX (.jsx)
- ✅ TSX (.tsx)

---

## ⚙️ الخيارات المتاحة

| الخيار | الوصف | القيمة الافتراضية |
|--------|-------|-------------------|
| \`--output <format>\` | صيغة المخرجات (console/json) | console |
| \`--no-issues\` | إخفاء المشاكل المحتملة | false |

---

## 💡 نصائح

### 1. استخدم مع Patch:

\`\`\`bash
# حلل أولاً
oqool-code analyze src/api.js

# شوف المشاكل، ثم إصلحها
oqool-code patch "استبدل جميع var بـ const" --files src/api.js
\`\`\`

---

### 2. تحليل دوري للمشروع:

\`\`\`bash
# script للتشغيل الدوري
for file in src/**/*.js; do
  oqool-code analyze $file --output json >> analysis-report.json
done
\`\`\`

---

### 3. تكامل مع CI/CD:

\`\`\`yaml
# .github/workflows/code-quality.yml
- name: Analyze Code
  run: |
    npm install -g @oqool/code
    oqool-code analyze src/**/*.js --no-issues
\`\`\`

---

## 🎓 ما هو AST؟

**AST (Abstract Syntax Tree)** هو تمثيل شجري للكود:

\`\`\`javascript
const x = 5;
\`\`\`

يتحول إلى:
\`\`\`
VariableDeclaration
  ├─ kind: "const"
  └─ declarations
      └─ VariableDeclarator
          ├─ id: Identifier (name: "x")
          └─ init: NumericLiteral (value: 5)
\`\`\`

هذا يسمح للأداة بـ:
- 🔍 فهم الكود بعمق
- 🎯 تعديله بدقة
- ⚠️ كشف الأخطاء
- 📊 قياس الجودة

---

## 📖 المراجع

- [Babel Parser](https://babeljs.io/docs/babel-parser)
- [AST Explorer](https://astexplorer.net/)
- [README.md](README.md)
- [PATCH_GUIDE.md](PATCH_GUIDE.md)

---

**صُنع بـ ❤️ بواسطة Oqool AI Team**
