const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connection = () => {
  mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Database connected Successfully"))
    .catch((err) => console.log(err));
};
module.exports = connection;
