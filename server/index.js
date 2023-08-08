const express = require("express");
const cors = require("cors");
const connection = require("./db"); // Передбачаємо, що у вас є окремий файл для підключення до бази даних
const userRoutes = require("./router/users");
const authRoutes = require("./router/auth");

const app = express();

// Підключення до бази даних
connection();

// Middlewares
app.use(express.json());

// Додайте налаштування для CORS перед визначенням маршрутів
app.use(cors());

// Маршрути
app.use("/api/users/signup", userRoutes);
app.use("/api/auth/signup", authRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
console.log(process.env);
