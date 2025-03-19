// Import dependencies
import express from "express";
import mysql from "mysql2";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

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

// Add School API
app.post("/addSchool", (req, res) => {
    const { name, address, latitude, longitude } = req.body;

    if (!name || !address || !latitude || !longitude) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const sql = "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, address, latitude, longitude], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "School added successfully!", schoolId: result.insertId });
    });
});

// Calculate distance function (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// List Schools API
app.get("/listSchools", (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Latitude and Longitude are required." });
    }

    const sql = "SELECT * FROM schools";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const sortedSchools = results.map((school) => {
            return {
                ...school,
                distance: calculateDistance(latitude, longitude, school.latitude, school.longitude)
            };
        }).sort((a, b) => a.distance - b.distance);

        res.json(sortedSchools);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
