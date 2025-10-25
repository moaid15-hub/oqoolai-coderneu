// ملف اختبار بدون أخطاء
// للتأكد من أن النظام يعمل بشكل صحيح

function greet(name) {
  return `Hello, ${name}!`;
}

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// اختبار الدوال
const name = 'Oqool';
console.log(greet(name));
console.log('5 + 3 =', add(5, 3));
console.log('4 x 7 =', multiply(4, 7));

console.log('\n✅ تم تشغيل الكود بنجاح!');
