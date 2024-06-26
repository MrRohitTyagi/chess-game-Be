import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import "dotenv/config";

//prisma imports
import client from "./config/prisma.client.js";

// routes import
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";

//middlewares
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

const httpServer = createServer(app);
const io = new Server(httpServer);

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);

app.get("/", (req, res) => res.send("Hello"));

app.get("/all", async (req, res) => {
  try {
    const products = await client.product.findMany({ where: {} });

    res.send({ products: products });
  } catch (error) {
    console.log("error", error);
  }
});

app.all("*", (req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on the server`);
  err.status = 404;
  next(err);
});

app.use(errorMiddleware);

// Socket code
io.on("connection", (socket) => {
  socket.emit("CONNECTION_SUCCESSFULL", socket.id);
  socket.on("FIND_RANDOM_SEARCHING_PLAYERS", async (e) => {
    const users = await client.user.findFirst({
      where: {
        isSearching: true,
        AND: { pk: { not: { equals: e.user_pk } } },
      },
    });
    socket.emit("PLAYERS_SEARCHING_FOR_GAME", users);
  });

  socket.on("JOIN_ROOM", (room_id) => {
    socket.join(room_id);
  });

  socket.on("MOVE_PLAYED", (data) => {
    const { room_id } = data;
    socket.to(room_id).emit("OPPONENT_PLAYED", data);
  });
});

httpServer.listen(5000, () => {
  console.log("server running at port 5000");
});
