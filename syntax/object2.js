// array, object
//var i = if(true) {console.log(1)};

//var w = while(true){console.log(1)};

var f = function () {
  console.log(1 + 1);
  console.log(1 + 2);
}; //함수도 데이터임
var a = [f];
a[0](); //배열의 원소로 함수가 존재 가능

var o = {
  func: f,
};
o.func();
