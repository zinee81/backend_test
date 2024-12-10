const db = require("./config/db");

const visit = async (req, res) => {
  const loginUserId = req.user.user_id;
  const courseQr = req.body.qr;

  // validation
  if (!courseQr) {
    return res.status(400).json({ status: "error", message: "qr 코드 정보는 필수입니다.", data: null });
  }

  // QR 정보 유효한지
  const QUERY1 = `
    SELECT
        course_id,
        course_name,
        course_latitude,
        course_longitude,
        course_qr
    FROM
        course
    WHERE
        course_qr = ?
    `;
  const course = await db.execute(QUERY1, [courseQr]).then((result) => result[0][0]);
  if (!course) {
    return res.status(404).json({ status: "error", message: "코스 정보가 없습니다.", data: null });
  }

  // 코스 방문 여부 - 방문했으면 어떻게 처리할것인가?
  // 1. 방문했으면 그냥 성공했다고 처리
  // 2. 방문했으면 방문한 코스입니다.
  // 여러번 방문이 가능하다면 기록을 남기고 몇번 방문했는지 기록
  const QUERY2 = `
  SELELCT 
    user_course_id
  FROM
    user_course
  WHERE
    user_id = ?
  AND
    course_id = ?
`;
  const isVisited = await db.execute(QUERY2, [loginUserId, course.course_id]).then((result) => result[0][0]);

  // 만약 방문했으면
  if (isVisited) {
    return res.status(409).json({ status: "error", message: "이미 방문한 코스입니다.", data: null });
  }

  // 처음 방문했고 정상적으로 들어왔으면 방문 처리
  const QUERY3 = `
    INSERT INTO user_course(
        user_id,
        course_id
    ) VALUES (
        ?,
        ?
    )`;
  await db.execute(QUERY3, [loginUserId, course.course_id]);

  return res.json({ status: "success", message: "방문에 성공했습니다.", data: null });
};

module.exports = visit;
