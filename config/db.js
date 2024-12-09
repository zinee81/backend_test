// 백엔드 서버 - DB 서버
// 요청이 올 때 커넥션을 만들어서 맺는 방식 (자원이 많이 듬)
// 미리 커넥션을 가지고 있는 방식 (커넥션 POOL)

const mysql = require("mysql2");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

const db = pool.promise();

module.exports = db;
