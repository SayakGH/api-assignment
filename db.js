
import mysql from "mysql2";


// MySQL Database Connection (Supabase MySQL)
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check DB Connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err);
    } else {
        console.log("Connected to Supabase MySQL database");
        connection.release();
    }
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS schools (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL
)`;

db.query(createTableQuery, (err, result) => {
    if (err) {
        console.error("Error creating table:", err);
    } else {
        console.log("Table 'schools' is ready!");
    }
});