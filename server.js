// .env 파일에서 환경 변수를 로드하여 process.env에 추가
require("dotenv").config();

// common.js
const express = require("express");
const join = require("./join");
const login = require("./login");
const auth = require("./middleware/auth");
const course = require("./course");
const visit = require("./visit");

const server = express();

server.use(express.json());

const PORT = 8080;

// 회원 도메인
// 회원 가입 서비스를 제공할 때 받아야 할 항목
// login_id, login_pw, name
server.post("/join", join);
server.post("/login", login);

// test 주소는 인증이 필요한 주소
server.get("/test", auth, (req, res) => {
  const loginUser = req.user;
  console.log(loginUser);
  console.log("=====성공");
  return res.send("성공");
});

// 코스 리스트 (인증이 필요한 endpoint 주소)
server.get("/courses", auth, course);

// qr -> 문자열 -> 서비스 로직 - 암호화, 거리계산(유효한 거리에 들어왔을 때 인증이 되도록) -> 그냥 서버로 보내면 됨
// qr -> 문자열 -> db 문자열이 있는지 확인하고 방문처리
server.post("/visit", auth, visit);

server.listen(8080, () => {
  console.info(`${PORT} 서버 오픈`);
});
