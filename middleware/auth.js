const jwt = require("jsonwebtoken");
const db = require("../config/db");

// header:{
//  Authorization : Bearer {{Token}}
// }
// 위 방식으로 보냄

const auth = async (req, res, next) => {
  // token 위치
  const authorization = req.headers.authorization; // Bearer {{Token}}
  if (!authorization) {
    return res.status(401).json({ status: "error", message: "토큰이 없습니다.", data: null });
  }

  // header : authorization 키가 있는 경우
  const token = authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ status: "error", message: "토큰이 없습니다.", data: null });
  }

  // 정상적인 토큰이 들어옴
  const secretKey = process.env.JWT_SECRET;
  let decoded;
  try {
    decoded = jwt.decode(token, secretKey);
  } catch (error) {
    return res.status(401).json({ status: "error", message: "토큰이 유효하지 않습니다.", data: null });
  }
  // decode id 가 없을 수도 있지만 validation 하지는 않음
  // user_id를 찾아옴
  const userId = decoded.id;
  const QUERY1 = `
  SELECT
    user_id,
    user_login_id,
    user_login_pw,
    user_name
  FROM
    user
  WHERE
    user_id = ?
  `;

  const user = await db.execute(QUERY1, [userId]).then((result) => result[0][0]);
  req.user = user;
  next();
};

module.exports = auth;
