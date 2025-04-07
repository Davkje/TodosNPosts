import mysql from 'mysql2/promise';

// Create the connection pool. The pool-specific settings are the defaults
export const db = mysql.createPool({
  host:     process.env.DB_HOST || "",
  user:     process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "",
  port:     parseInt(process.env.DB_PORT || "3306") 
});

export const connectToDatabase = async () => {
  try {
    await db.getConnection();
    console.log('Connected to DB')
  } catch (error: unknown) {
    console.log('Error connecting to DB: ' + error)
  }
}