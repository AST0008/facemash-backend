const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const photoRoutes = require("./routes/photoRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";
const mongoURI = isProduction
  ? process.env.PROD_MONGO_URI
  : process.env.DEV_MONGO_URI;

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) =>
    console.log("Could not connect to the database. Exiting now...", err)
  );

app.use("/api/photos", photoRoutes);

app.listen(5000, () => {
  console.log("Server is running on port 3000");
});
