var testFolder = "./data/";
var fs = require("fs");

fs.readdir(testFolder, function (error, filelist) {
  console.log(filelist);
}); //특정 디렉토리 파일의 목록을 배열로 반환함
