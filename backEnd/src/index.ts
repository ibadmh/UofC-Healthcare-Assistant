import express from "express";
import cors from "cors";

const app = express();
app.use(cors(
  {origin: "http://localhost:5173"}
));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("UHealth Friend Backend Running");
});

app.listen(5000, () => {
  console.log("Backend server running on port 5000");
});
