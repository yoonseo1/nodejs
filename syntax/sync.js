var fs = require("fs");

/*
//readFileSync 동기적인 방식 ABC 순차적으로 출력
console.log("A");
var result = fs.readFileSync("syntax/sample.txt", "utf8");
console.log(result);
console.log("C");
*/

// sync가 없음 비동기적 방식 ACB출력
console.log("A");
fs.readFile("syntax/sample.txt", "utf8", function (err, result) {
  //리턴값 없음, 세 번째 인자를 함수(callback)로 주어야 함
  console.log(result);
});
console.log("C");
