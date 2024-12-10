const db = require("./config/db");

const course = async (req, res) => {
  const loginId = req.user.user_id;

  const QUERY = `
  SELECT 
    c.course_id,
    c.course_name,
    c.course_latitude,
    c.course_longitude,
    c.course_qr,
    CASE
        WHEN uc.user_course_id IS NOT NULL THEN 'true'
        ELSE 'false'
    END AS is_visited
  FROM
    course c
  LEFT JOIN
    user_course uc ON c.course_id = uc.course_id AND uc.user_id = ?
  `;

  const courseList = await db.execute(QUERY, [loginId]).then((result) => result[0]);
  return res.json({ status: "success", message: "코스 목록 조회에 성공하셨습니다.", data: courseList });
};

module.exports = course;
