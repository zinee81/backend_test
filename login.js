const db = require("./config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// id, pw
const login = async (req, res) => {
  const loginId = req.body.id;
  const loginPw = req.body.pw;

  // validation (유효성 검사)
  // id, pw가 들어오지 않으면 에러를 응답
  // 400번 에러 BAD REQUEST
  if (!loginId || !loginPw) {
    return res.status(400).json({ status: "error", message: "id, pw는 필수입니다.", data: null });
  }

  // 데이터베이스 id 조회 - 유저 조회
  const QUERY1 = `
  SELECT
    user_id,
    user_login_id,
    user_login_pw,
    user_name
  FROM
    user
  WHERE
    user_login_id = ?
  `;
  // ? -> 해커의 공격을 막기위한 한 방법

  const user = await db.execute(QUERY1, [loginId]).then((result) => result[0][0]);

  // 404 - not found
  if (!user) {
    return res.status(404).json({ status: "error", message: "존재하지 않는 id 입니다.", data: null });
  }

  // pw 확인 (비밀번호 비교)
  const isMatch = await bcrypt.compare(loginPw, user.user_login_pw);
  if (!isMatch) {
    // UnAuthorise
    return res.status(401).json({ status: "error", message: "비밀번호가 일치하지 않습니다.", data: null });
  }

  // 정상적으로 로그인되었습니다.
  // 첫번째 : 넣을값(객체), 두번째 : 암호키, 세번째 : 만료일(객체)-옵션
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign({ id: user.user_id }, secretKey, { expiresIn: "10d" });

  return res.status(200).json({ status: "success", message: "로그인 성공", data: { token: token } });
};

// 서버에서 로그인을 관리할때 방법
// 1. session - cookie (쿠키는 위험하다고 생각)
// 2. JWT token (라이브러리 설치)
// - access Token (8시간)
// - refresh Token (일주일)

module.exports = login;
