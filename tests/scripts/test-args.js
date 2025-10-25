// ملف اختبار للمعاملات (args)

console.log('📝 المعاملات المُمررة:');
console.log('عدد المعاملات:', process.argv.length);
console.log('المعاملات:', process.argv.slice(2));

if (process.argv.length > 2) {
  console.log('\n✅ تم استلام المعاملات بنجاح!');
} else {
  console.log('\n⚠️ لم يتم تمرير معاملات');
}
