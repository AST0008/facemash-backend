const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const photoRoutes = require("./routes/photoRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

require("dotenv").config();

const PORT = process.env.PORT || 5000; // Use Render’s assigned port

const isProduction = process.env.NODE_ENV === "production";
const mongoURI = isProduction
  ? process.env.PROD_MONGO_URI
  : "mongodb://localhost:27017/facemash";

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
