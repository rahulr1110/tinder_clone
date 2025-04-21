import { Server } from "socket.io";

let io;

const connectedUser = new Map();

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) return next(new Error("invalid user id"));
    socket.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    console.log(`user connected ${socket.id}`);
    connectedUser.set(socket.userId, socket.id);

    socket.on("disconnect", () => {
      console.log(`user disconnected with socket id :${socket.id} `);
      connectedUser.delete(socket.userId);
    });
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error("socket io not intiallized");
  }
  return io;
};

export const getConnectedUser = () => {
  return connectedUser;
};
