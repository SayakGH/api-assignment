# 📚 School Management API Documentation

## 📌 General Description
The **School Management API** provides two key functionalities: adding new schools and retrieving a list of schools sorted by proximity to a user-specified location. The backend is built using **Node.js and Express.js**, and it connects to a **MySQL database hosted on Supabase**. The **Haversine formula** is used to calculate distances, ensuring accurate sorting.

---

## 🚀 API Endpoints

### **1️ Add a School**
- **Endpoint:** `POST /addSchool`
- **Description:** This endpoint allows users to add a new school to the database by providing necessary details such as the school's name, address, latitude, and longitude. The data is validated before being inserted into the database.

### **2 Add a School**
- **Endpoint:** `GET /listSchool`
- **Description:** This endpoint retrieves all schools stored in the database and sorts them based on their proximity to the latitude and longitude provided in the request. The API calculates the geographical distance between each school and the given location using the Haversine formula and sorts the schools in ascending order of distance. If the latitude and longitude parameters are not provided, the API returns an error message. If no schools are found, an empty array is returned.