const express = require("express");
const dotenv = require("dotenv");
const connection = require("./database/connection");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const buyerRoute = require("./routes/buyerRoutes");
const sellerRoute = require("./routes/sellerRoutes");
const authRoute = require("./routes/authRoute");

dotenv.config();

connection();
const app = express();
app.use(express.json());

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  // Set CORS headers
  res.header("Access-Control-Allow-Origin", "*"); // Replace with your frontend domain
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials (cookies, etc.)
  next();
});

app.use("/api/user", buyerRoute);
app.use("/api/seller", sellerRoute);
app.use("/api/auth", authRoute);

app.listen(8000 || process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
