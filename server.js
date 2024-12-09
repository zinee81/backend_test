// .env 파일에서 환경 변수를 로드하여 process.env에 추가
require("dotenv").config();
const db = require("./config/db");
const bcrypt = require("bcrypt");

// common.js
const express = require("express");

const server = express();

server.use(express.json());

const PORT = 8080;

// 회원 도메인
// 회원 가입 서비스를 제공할 때 받아야 할 항목
// login_id, login_pw, name
server.post("/join", async (req, res) => {
  // body
  const loginId = req.body.id;
  const loginPw = req.body.pw;
  const name = req.body.name || "";

  // 서버 유효성 검사 (필수), 클라이언트 유효성 검사 (선택)
  if (!loginId || !loginPw) {
    // 에러를 응답
    // 400 - Bad Request
    return res.status(400).json({ status: "error", message: "id, pw는 필수입니다.", data: null });
  }

  // 중복검사 loginId
  const QUERY1 = `
    select
        user_id,
        user_login_id,
        user_login_pw,
        user_name
    from
        user
    where
        user_login_id = ?`;

  const user = await db.execute(QUERY1, [loginId]).then((result) => result[0][0]);
  if (user) {
    return res.status(409).json({ status: "error", message: "이미 존재하는 id 입니다.", data: null });
  }

  // 비밀번호 암호화
  const encryptPw = await bcrypt.hash(loginPw, 10); //8 - 성능 중시, 10 - 보통, 12 - 강한 보안

  // 데이터베이스 사용자 정보 저장
  QUERY2 = `
    insert into user (
        user_login_id,
        user_login_pw,
        user_name
    ) values (
        ?,
        ?,
        ?
    )`;

  await db.execute(QUERY2, [loginId, encryptPw, name]);

  // 성공 응답
  return res.status(200).json({ status: "sucsess", message: "회원가입 성공", data: null });
});

server.listen(8080, () => {
  console.info(`${PORT} 서버 오픈`);
});
