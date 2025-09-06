const mysql = require('mysql2'); 
require('dotenv').config();       


const pool = mysql.createPool({
  host: process.env.DB_HOST,       
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,   
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();


pool.query('SELECT 1')
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Connection error:", err));

module.exports = pool;
