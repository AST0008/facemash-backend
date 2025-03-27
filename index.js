const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const photoRoutes = require("./routes/photoRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect("mongodb://localhost:27017/facemash", {
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
