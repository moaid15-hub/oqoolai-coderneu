// ملف اختبار لنظام Code Executor
// يحتوي على خطأ متعمد لاختبار Auto-fix

function greet(name) {
  console.log(`Hello, ${name}!`);
}

// خطأ متعمد: استدعاء متغير غير معرف
greet(userName);  // ← userName غير معرف!

// دالة بسيطة أخرى
function add(a, b) {
  return a + b;
}

console.log('Result:', add(5, 3));
