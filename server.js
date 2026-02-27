const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const connectDB = require("./config/db");
connectDB();

const uploadRoutes = require("./routes/upload.routes");
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const restaurantRoutes = require("./routes/restaurant.routes");
const categoryRoutes = require("./routes/category.routes");

const notFound = require("./middleware/notFound.middleware");
const errorHandler = require("./middleware/error.middleware");


const app = express();

app.use(cors({ origin:["http://localhost:5173","https://e-commerce-backend-xqvn.onrender.com"], credentials: true }));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));