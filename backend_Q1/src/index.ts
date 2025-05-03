import express from "express";
import userRoutes from "./routes/user.routes.js";
import postRoutes from "./routes/post.routes.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(userRoutes);
app.use(postRoutes);

app.listen(PORT, () =>
  console.log(`Server is live on http://localhost:${PORT}`)
);
