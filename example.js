/**
 * دالة بسيطة لحساب مجموع رقمين
 * @param {number} a - الرقم الأول
 * @param {number} b - الرقم الثاني
 * @returns {number} مجموع الرقمين
 */
function sum(a, b) {
    return a + b;
}

// أمثلة على الاستخدام
console.log('5 + 3 =', sum(5, 3));        // النتيجة: 8
console.log('10 + 7 =', sum(10, 7));      // النتيجة: 17
console.log('-2 + 8 =', sum(-2, 8));      // النتيجة: 6
console.log('1.5 + 2.5 =', sum(1.5, 2.5)); // النتيجة: 4

// تصدير الدالة للاستخدام في ملفات أخرى
module.exports = sum;