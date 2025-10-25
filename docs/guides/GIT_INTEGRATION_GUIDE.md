# 🔀 دليل Git Integration

## 📖 المقدمة

نظام **Git Integration** في Oqool Code يتكامل تلقائياً مع Git لإدارة التغييرات:

- 🌿 **إنشاء Branches تلقائياً** من الـ prompt
- 💾 **Commits ذكية** بر سائل واضحة
- 📊 **عرض Diff** قبل الـ commit
- 🚀 **Push تفاعلي** للـ remote
- ✨ **Workflow سلس** بدون تعقيد

---

## 🚀 الاستخدام السريع

### 1️⃣ مع أمر `generate`

```bash
oqool-code "اصنع API بسيط"
```

**ما يحدث:**
1. ✅ AI يولد الكود
2. ✅ يسألك: هل تكتب الملفات؟
3. ✅ يكتب الملفات
4. 🔀 يسألك: هل تعمل commit وpush؟
5. 🌿 ينشئ branch جديد (مثل: `feature/asn-api-bsit-123456`)
6. 📦 يضيف الملفات
7. 📊 يعرض الـ diff
8. 💾 يعمل commit
9. 🚀 يسألك: هل تعمل push؟

---

### 2️⃣ مع أمر `patch`

```bash
oqool-code patch "حسن أداء الدالة" --files src/api.js
```

**ما يحدث:**
1. ✅ AI يحلل ويولد patches
2. ✅ يسألك: هل تطبق التعديلات؟
3. ✅ يطبق التعديلات
4. 🔀 يسألك: هل تعمل commit وpush؟
5. 🌿 ينشئ branch جديد
6. 💾 يعمل commit
7. 🚀 يسألك: push؟

---

## 🎯 سيناريو كامل

```bash
# 1. أنت في مشروعك (git repo)
cd my-project

# 2. استخدم oqool-code
oqool-code "أضف validation للـ API"

# 3. AI يولد الكود
✅ تم توليد الكود بنجاح!

📝 تم اكتشاف 2 ملف(ات):
  1. src/middleware/validation.js
  2. src/routes/api.js

? هل تريد كتابة هذه الملفات؟ (Y/n) y

✅ تم كتابة جميع الملفات بنجاح! ✨

# 4. Git Integration
🔀 Git Integration

? هل تريد عمل commit وpush تلقائي؟ (Y/n) y

🌿 Branch الحالي: main

🔀 إنشاء branch جديد: feature/add-validation-ll-api-789012...
✅ تم إنشاء branch: feature/add-validation-ll-api-789012

📦 إضافة 2 ملف(ات)...
✅ تم إضافة 2 ملف(ات)

📊 التغييرات:
════════════════════════════════════════════════════════════
📁 الملفات: 2
+ إضافات: 45
- حذف: 0
════════════════════════════════════════════════════════════

💾 عمل commit...
✅ تم عمل commit: a1b2c3d

? 🚀 هل تريد push للـ remote؟ (y/N) y

✅ تم push إلى origin/feature/add-validation-ll-api-789012
```

---

## 🔧 كيف يعمل؟

### 1. **تتبع الملفات المتغيرة**

File Manager يتتبع تلقائياً جميع الملفات التي تم تعديلها:

```typescript
// في file-manager.ts
private changedFiles: Set<string>;

async writeFile(filePath: string, content: string) {
  // ... كتابة الملف
  this.changedFiles.add(filePath);  // ← تتبع
}
```

---

### 2. **توليد اسم Branch ذكي**

من الـ prompt:

```typescript
generateBranchName(prompt: string, prefix: string = 'feature'): string {
  // مثال:
  // "اصنع API بسيط" → "feature/asn-api-bsit-123456"

  let branchName = prompt
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')  // حذف الرموز
    .replace(/\s+/g, '-')       // مسافات → -
    .substring(0, 50);          // تحديد الطول

  const timestamp = Date.now().toString().substring(-6);

  return `${prefix}/${branchName}-${timestamp}`;
}
```

**أمثلة:**

| Prompt | Branch Name |
|--------|-------------|
| اصنع API بسيط | `feature/asn-api-bsit-123456` |
| Fix bug in login | `feature/fix-bug-in-login-789012` |
| Add user dashboard | `feature/add-user-dashboard-345678` |

---

### 3. **توليد رسالة Commit**

```typescript
generateCommitMessage(files: string[], prompt?: string): string {
  if (prompt) {
    const shortPrompt = prompt.substring(0, 50);
    return `feat: ${shortPrompt}

🤖 Generated with Oqool Code`;
  }

  // أو من أسماء الملفات:
  const fileNames = files.map(f => path.basename(f)).slice(0, 3);
  return `chore: update ${fileNames.join(', ')}

🤖 Generated with Oqool Code`;
}
```

**أمثلة:**

```
feat: اصنع API بسيط

🤖 Generated with Oqool Code
```

```
chore: update validation.js, api.js + 3 more

🤖 Generated with Oqool Code
```

---

### 4. **عرض Diff جميل**

```bash
📊 التغييرات:
════════════════════════════════════════════════════════════
📁 الملفات: 2
+ إضافات: 45
- حذف: 3
════════════════════════════════════════════════════════════
+++ src/middleware/validation.js
+ export function validateUser(data) {
+   if (!data.email) throw new Error('Email required');
+   return true;
+ }

+++ src/routes/api.js
+ import { validateUser } from '../middleware/validation';
- // TODO: add validation
+ app.post('/users', validateUser, createUser);
════════════════════════════════════════════════════════════
```

---

## ⚙️ الخيارات

### تعطيل Git Integration

```bash
# لا تستخدم Git
oqool-code "اصنع API" --no-git

# أو مع patch
oqool-code patch "حسن الكود" --files src/api.js --no-git
```

---

## 📊 Git Manager API

### للمطورين:

```typescript
import { createGitManager } from '@oqool/code';

const git = createGitManager();

// 1. التحقق من git repo
if (await git.isGitRepo()) {
  console.log('✅ Git repo');
}

// 2. معلومات Branch
const info = await git.getCurrentBranch();
// { current: 'main', isClean: true, hasRemote: true }

// 3. إنشاء branch
await git.createBranch('feature/new-feature');

// 4. إضافة ملفات
await git.addFiles(['src/api.js', 'src/utils.js']);

// 5. commit
await git.commit('feat: add new API');

// 6. عرض diff
await git.displayDiff();

// 7. push
await git.push('feature/new-feature', true);

// 8. Workflow كامل
await git.autoWorkflow(
  ['src/api.js'],
  'اصنع API',
  {
    autoCommit: true,
    autoPush: false,
    branchPrefix: 'feature'
  }
);
```

---

## 🎯 أمثلة عملية

### مثال 1: تطوير ميزة جديدة

```bash
# 1. في main branch
git branch
* main

# 2. استخدم oqool-code
oqool-code "أضف ميزة Dark Mode"

# AI يولد الكود...
# يكتب الملفات...

# 3. Git workflow
🔀 Git Integration

? هل تريد عمل commit وpush تلقائي؟ Yes

🌿 إنشاء branch: feature/add-myz-dark-mode-123456
✅ تم عمل commit: abc123d

? 🚀 push؟ Yes
✅ تم push!

# 4. الآن لديك:
git branch
  main
* feature/add-myz-dark-mode-123456

git log --oneline
abc123d feat: أضف ميزة Dark Mode
```

---

### مثال 2: إصلاح bug

```bash
oqool-code patch "إصلح خطأ في دالة login" --files src/auth.js

# AI يحلل ويولد patches...
# يطبق التعديلات...

🔀 Git Integration

? commit وpush؟ Yes

🌿 إنشاء branch: feature/islh-kht-fy-dal-login-456789
✅ commit: def456a

? push؟ No  # لا تريد push الآن

# يمكنك push لاحقاً:
git push -u origin feature/islh-kht-fy-dal-login-456789
```

---

### مثال 3: تعديلات متعددة

```bash
# تعديل 1
oqool-code patch "حسن أداء API" --files src/api.js

# branch جديد + commit

# تعديل 2 (على نفس الـ branch)
oqool-code patch "أضف tests" --files tests/api.test.js

# سيسأل عن branch جديد أو نفس الـ branch الحالي
```

---

## 🔍 تفاصيل تقنية

### Branch Creation

```typescript
async createBranch(branchName: string): Promise<GitResult> {
  const result = await this.runGitCommand(['checkout', '-b', branchName]);

  if (result.exitCode === 0) {
    return {
      success: true,
      message: `تم إنشاء branch: ${branchName}`,
      branch: branchName
    };
  }
  // ...
}
```

---

### Add Files

```typescript
async addFiles(files: string[]): Promise<GitResult> {
  const result = await this.runGitCommand(['add', ...files]);
  // ...
}
```

---

### Commit

```typescript
async commit(message: string): Promise<GitResult> {
  const result = await this.runGitCommand(['commit', '-m', message]);

  // استخراج commit hash
  const hashResult = await this.runGitCommand(['rev-parse', '--short', 'HEAD']);
  const commitHash = hashResult.stdout;

  return {
    success: true,
    message: `تم عمل commit: ${commitHash}`,
    commit: commitHash
  };
}
```

---

### Push with Upstream

```typescript
async push(branch?: string, setUpstream: boolean = false): Promise<GitResult> {
  const args = setUpstream
    ? ['push', '-u', 'origin', targetBranch]
    : ['push', 'origin', targetBranch];

  const result = await this.runGitCommand(args);
  // ...
}
```

---

## 💡 نصائح

### 1. استخدم أسماء واضحة

```bash
# ✅ جيد
oqool-code "أضف validation للمستخدمين"

# ❌ غير واضح
oqool-code "اعمل شي"
```

الاسم الواضح → branch name واضح!

---

### 2. راجع الـ Diff

دائماً راجع الـ diff قبل الـ commit:

```
📊 التغييرات:
...
```

تأكد من التعديلات صحيحة!

---

### 3. لا تنسى Push

إذا قلت "No" للـ push، لا تنسى تعمله لاحقاً:

```bash
git push -u origin <branch-name>
```

---

### 4. Pull Requests

بعد الـ push، اذهب لـ GitHub/GitLab وافتح Pull Request:

```bash
# GitHub CLI
gh pr create --title "Add Dark Mode" --body "Description..."

# أو على الموقع
# https://github.com/user/repo/compare/feature/...
```

---

## 🐛 استكشاف الأخطاء

### "ليس git repository"

```bash
# تأكد من git init
git init

# أو clone مشروع موجود
git clone <repo>
```

---

### "لا يوجد remote مُعرف"

```bash
# أضف remote
git remote add origin <url>

# تحقق
git remote -v
```

---

### "dubious ownership"

```bash
# أضف المجلد للقائمة الآمنة
git config --global --add safe.directory /path/to/repo
```

---

## 📚 المراجع

- [README.md](README.md)
- [PATCH_GUIDE.md](PATCH_GUIDE.md)
- [CODE_EXECUTOR_GUIDE.md](CODE_EXECUTOR_GUIDE.md)
- [git-manager.ts](src/git-manager.ts)

---

## 🎓 حالات استخدام متقدمة

### 1. **CI/CD Integration**

```yaml
# .github/workflows/oqool-code.yml
name: Oqool Code Auto-Update

on:
  schedule:
    - cron: '0 0 * * 0'  # كل أسبوع

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm install -g @oqool/code
      - run: oqool-code "حدث dependencies" --no-git
      - run: git add .
      - run: git commit -m "chore: update dependencies"
      - run: git push
```

---

### 2. **Pre-commit Hooks**

```bash
# .git/hooks/pre-commit
#!/bin/bash

# تشغيل oqool-code لتحسين الكود قبل commit
oqool-code patch "حسن الكود" --files $(git diff --cached --name-only) --no-git
```

---

### 3. **Automated Code Review**

```bash
# قبل الـ PR
oqool-code "راجع الكود واقترح تحسينات" --files src/**/*.js --no-git
```

---

**صُنع بـ ❤️ بواسطة Oqool AI Team**
