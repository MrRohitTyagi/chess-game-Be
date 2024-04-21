import express from "express";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = 404;
  next(err);
});

app.use(errorMiddleware);

app.listen(5000, () => {
  console.log("server running at port 5000");
});
