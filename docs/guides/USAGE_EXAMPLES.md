# أمثلة الاستخدام - Oqool Code

## 🚀 أمثلة عملية

### 1. إنشاء Express API كامل

```bash
cd my-project
oqool-code "اصنع Express.js API مع:
- Routes للمستخدمين والمنتجات
- Middleware للمصادقة
- معالجة الأخطاء
- اتصال بـ MongoDB
- تنظيم بنيوي احترافي"
```

**النتيجة:**
```
src/
├── server.ts
├── config/
│   └── database.ts
├── middleware/
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/
│   ├── users.ts
│   └── products.ts
├── controllers/
│   ├── userController.ts
│   └── productController.ts
└── models/
    ├── User.ts
    └── Product.ts
```

---

### 2. إضافة ميزة لمشروع موجود

```bash
# أولاً، دع الأداة تفهم مشروعك
oqool-code structure

# ثم أضف الميزة
oqool-code "أضف نظام تحميل الصور مع:
- Multer middleware
- تخزين في S3
- معالجة وضغط الصور
- حدود الحجم والنوع" \
--files src/server.ts src/routes/users.ts
```

---

### 3. كتابة اختبارات

```bash
oqool-code "اكتب اختبارات Jest شاملة لـ:
- جميع API endpoints
- Authentication middleware
- Database models
مع mocking للـ database" \
--files src/routes/*.ts src/middleware/auth.ts
```

---

### 4. تحويل مشروع JavaScript إلى TypeScript

```bash
oqool-code "حول هذا المشروع إلى TypeScript مع:
- Types كاملة
- Interfaces للـ Models
- tsconfig.json مناسب
- تحديث package.json" \
--max-files 20
```

---

### 5. محادثة تفاعلية لتطوير تدريجي

```bash
oqool-code chat

أنت: أريد بناء تطبيق Todo
🤖 Oqool: سأساعدك! دعني أصنع البنية الأساسية...

أنت: ممتاز، الآن أضف نظام مستخدمين
🤖 Oqool: حاضر، سأضيف Authentication...

أنت: أضف صلاحيات للمستخدمين
🤖 Oqool: سأصنع نظام Roles...

أنت: اكتب اختبارات
🤖 Oqool: سأكتب الاختبارات...

أنت: exit
```

---

### 6. إعادة هيكلة كود

```bash
oqool-code "أعد هيكلة هذا الكود ليكون:
- أكثر قابلية للقراءة
- يتبع Clean Code principles
- منظم في modules منفصلة
- مع تعليقات واضحة" \
--files src/utils/helper.ts
```

---

### 7. إنشاء مكونات React

```bash
oqool-code "اصنع مكونات React لـ:
- Dashboard للإحصائيات
- جدول بيانات مع pagination
- نموذج تسجيل مع validation
- Navigation bar responsive
مع TypeScript و Tailwind CSS"
```

---

### 8. إضافة توثيق

```bash
oqool-code "أضف توثيق JSDoc شامل لجميع الدوال والـ Classes في:
- ملفات الـ API
- ملفات الـ Utils
- ملفات الـ Models
مع أمثلة الاستخدام" \
--files src/**/*.ts
```

---

### 9. تحسين الأداء

```bash
oqool-code "حلل وحسن أداء الكود في:
- إضافة Caching
- تحسين Database queries
- استخدام async/await بشكل أفضل
- إضافة Rate limiting" \
--files src/routes/*.ts src/controllers/*.ts
```

---

### 10. مشروع كامل من الصفر

```bash
oqool-code "اصنع تطبيق Next.js 14 كامل:

**Frontend:**
- صفحات: Home, About, Blog, Contact
- مكونات مشتركة: Header, Footer, Card
- Tailwind CSS و Dark mode
- SEO optimization

**Backend:**
- API Routes للـ Blog
- Prisma مع PostgreSQL
- Authentication بـ NextAuth
- معالجة الأخطاء

**Utils:**
- دوال مساعدة
- Types و Interfaces
- Constants

**Config:**
- Environment variables
- TypeScript strict mode
- ESLint و Prettier

مع README شامل"
```

---

## 💡 نصائح للحصول على أفضل النتائج

### ✅ افعل:

1. **كن محدداً:**
   ```bash
   ✅ "اصنع Express API مع JWT authentication و MongoDB"
   ❌ "اصنع API"
   ```

2. **اذكر التقنيات:**
   ```bash
   ✅ "React component مع TypeScript و Tailwind"
   ❌ "مكون React"
   ```

3. **حدد البنية:**
   ```bash
   ✅ "نظام MVC مع separate routes و controllers"
   ❌ "نظم الكود"
   ```

4. **استخدم السياق:**
   ```bash
   ✅ oqool-code "..." --files src/server.ts
   ❌ oqool-code "..." (بدون سياق)
   ```

### ❌ لا تفعل:

1. طلبات غامضة بدون تفاصيل
2. طلب كل شيء مرة واحدة (قسمها لأجزاء)
3. تجاهل مراجعة الكود قبل الكتابة

---

## 🎯 حالات استخدام شائعة

### للمبتدئين:
- إنشاء مشاريع تعليمية
- فهم البنية الصحيحة
- تعلم Best practices

### للمحترفين:
- توليد Boilerplate سريع
- كتابة اختبارات
- إعادة هيكلة Legacy code

### للفرق:
- توحيد الكود
- إنشاء Templates
- توليد Documentation

---

## 📞 هل تحتاج مساعدة؟

- 📧 البريد: support@oqool.net
- 💬 Discord: [انضم هنا](https://discord.gg/oqool)
- 📖 الوثائق: [docs.oqool.net](https://docs.oqool.net)
