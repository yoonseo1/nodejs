var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
// const path = require("path");
//refactorying
var template = require("./lib/template.js");
var path = require("path");
var sanitizeHtml = require("sanitize-html");

var app = http.createServer(function (request, response) {
  //nodejs가 웹브라우저 접속이 들어올 때마다 callback함수를 호출 request는 요청 할 때 웹브라우저가 보낸 정보들 response는 응답할 때 우리가 웹브라우저한테 전송할 정보들
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  //console.log(queryData.id);
  //console.log(url.parse(_url, true).pathname);

  if (pathname === "/") {
    //pathname이 /일 때
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        //console.log(filelist);
        var title = "Welcome";
        var description = "Hello, Node.js";

        /*var list = `<ul>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ul>`;*/

        /*
        var list = templateList(filelist);

        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(template);
        */

        var list = template.list(filelist);

        var html = template.html(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      });
    } else {
      //id값이 있는 경우
      fs.readdir("./data", function (error, filelist) {
        console.log(filelist);
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title); //script태그를 살균함, h1태그는 태그는 없애고 내용은 살림
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ["h1"],
          });
          var list = template.list(filelist);
          var html = template.html(
            sanitizedTitle,
            list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
              <a href="/update?id=${sanitizedTitle}">update</a>
              <form action="delete_process" method="post" >
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
              </form>`
            //삭제 버튼은 링크로 만들면 절대 안됨
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      var title = "WEB - create";
      var list = template.list(filelist);
      var html = template.html(
        title,
        list,
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"/></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
        <!-- form 안에 들어있는 각각의 정보를 submit버튼을 눌렀을 때 action속성이 가리키는 서버로 쿼리스트링 형태로 데이터를 전송 -->
        <!-- 서버에 데이터를 생성, 수정, 삭제할 때는 url로 보내면 안됨 -> 눈에 보이지 않는
        방법으로 get 할 때는 상관 없음, 아주 큰 데이터도 전송할 수 있음 -->

        `,
        ""
      );
      response.writeHead(200);
      response.end(html);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      //웹 브라우저가 post로 데이터를 전송하면 엄청난 큰 데이터 일 때를 대비해서 이런 사용방법 제공 어떤 특정한 양의 조각들을 수신할 때마다 서버는 callback함수를 호출하도록 함
      body = body + data; //body에 callback이 실행될 때마다 데이터를 추가
    });
    request.on("end", function () {
      //들어올 정보가 더이상 없을 때 end에 해당되는 callback이 수신되었을 때 정보가 끝났음을 알 수 있음
      var post = qs.parse(body); //parse 함수를 통해 정보를 객체화
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end("success");
      });
      //console.log(post.description); //post를 통해 전송된 데이터를 가져올 수 있음
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      console.log(filelist);
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, "utf8", function (err, description) {
        var title = queryData.id;
        var list = template.list(filelist);
        var html = template.html(
          title,
          list,
          `
          <form action="/update_process" method="post">
          <input type="hidden", name="id", value="${title}">

          <p><input type="text" name="title" placeholder="title" value="${title}"/></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
        <!-- form 안에 들어있는 각각의 정보를 submit버튼을 눌렀을 때 action속성이 가리키는 서버로 쿼리스트링 형태로 데이터를 전송 -->
        <!-- 서버에 데이터를 생성, 수정, 삭제할 때는 url로 보내면 안됨 -> 눈에 보이지 않는
        방법으로 get 할 때는 상관 없음, 아주 큰 데이터도 전송할 수 있음 -->

          
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === "/update_process") {
    var body = "";
    request.on("data", function (data) {
      //웹 브라우저가 post로 데이터를 전송하면 엄청난 큰 데이터 일 때를 대비해서 이런 사용방법 제공 어떤 특정한 양의 조각들을 수신할 때마다 서버는 callback함수를 호출하도록 함
      body = body + data; //body에 callback이 실행될 때마다 데이터를 추가
    });
    request.on("end", function () {
      //들어올 정보가 더이상 없을 때 end에 해당되는 callback이 수신되었을 때 정보가 끝났음을 알 수 있음
      var post = qs.parse(body); //parse 함수를 통해 정보를 객체화
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, "utf8", function (err) {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        });
      });
      console.log(post);
      //console.log(post.description); //post를 통해 전송된 데이터를 가져올 수 있음
    });
  } else if (pathname === "/delete_process") {
    var body = "";
    request.on("data", function (data) {
      //웹 브라우저가 post로 데이터를 전송하면 엄청난 큰 데이터 일 때를 대비해서 이런 사용방법 제공 어떤 특정한 양의 조각들을 수신할 때마다 서버는 callback함수를 호출하도록 함
      body = body + data; //body에 callback이 실행될 때마다 데이터를 추가
    });
    request.on("end", function () {
      //들어올 정보가 더이상 없을 때 end에 해당되는 callback이 수신되었을 때 정보가 끝났음을 알 수 있음
      var post = qs.parse(body); //parse 함수를 통해 정보를 객체화
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function (error) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });

      //console.log(post.description); //post를 통해 전송된 데이터를 가져올 수 있음
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});
app.listen(3000);
