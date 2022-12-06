// function a() {
//   console.log("A");
// }

var a = function () {
  //a라는 변수의 값으로서 함수를 정의, 함수는 값임
  console.log("A");
};

//a();

function slowfunc(callback) {
  callback();
}

slowfunc(a);
