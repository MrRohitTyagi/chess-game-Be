import express from "express";
import userRouter from "./routes/user.routes.js";
import cors from "cors";
import "dotenv/config";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { createServer } from "http";
import { Server } from "socket.io";
import client from "./config/prisma.client.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use("/api/v1/user", userRouter);

app.get("/", (req, res) => res.send("Hello"));

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = 404;
  next(err);
});

app.use(errorMiddleware);

// Socket code
io.on("connection", (socket) => {
  console.log("socket.id", socket.id);
  socket.emit("CONNECTION_SUCCESSFULL", socket.id);

  socket.on("FIND_RANDOM_SEARCHING_PLAYERS", async (e) => {
    const users = await client.user.findFirst({
      where: {
        isSearching: true,
        AND: { pk: { not: { equals: e.user_pk } } },
      },
    });
    console.log("searchingplayers");
    socket.emit("PLAYERS_SEARCHING_FOR_GAME", users);
  });
});

httpServer.listen(5000, () => {
  console.log("server running at port 5000");
});
