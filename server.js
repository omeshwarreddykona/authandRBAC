import express from "express";
import router from "./routes/apis.js";
import connectDB from "./database/db.js";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use("/api", router);


app.listen(3009, () => {
  console.log("Server running on port 3009");
});
