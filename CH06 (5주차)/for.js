console.log('===== 초기 배열 데이터 =====');
var arr = ["자바스크립트", "C언어", "파이썬"]
console.log(arr[0]);
console.log(arr[1]);
console.log(arr[2]);

console.log();
console.log('===== 배열에 데이터 추가 =====');

arr.push('ASP.net');
arr.push('C#.net');

console.log();
console.log('===== 배열의 출력 =====');

console.log('배열의 길이:' + arr.length);
for (var i = 0; i < arr.length; i++) {
    console.log(arr[i]);
}