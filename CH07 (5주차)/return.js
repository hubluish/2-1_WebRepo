const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function checkAge (age) {
    if (age > 19) {
        return true;
    } 
    else {
        return false;
    }
}

rl.question('나이를 입력하세요.: ', function (age) {
    if (checkAge(age)) {
        console.log('입장 가능합니다.');
    } else {
        console.log('입장을 불허합니다.');
    }
    rl.close();
});