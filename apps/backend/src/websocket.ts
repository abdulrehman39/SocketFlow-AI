import { Server as SocketIOServer } from "socket.io";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export function setupWebSocket(io: SocketIOServer) {
  // Middleware for auth
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error("Authentication error: Missing token"));
    }
    
    // In a real application, verify JWT token here
    // For MVP, we pass anything and mock user logic
    socket.data.userId = "user_123";
    
    next();
  });

  io.on("connection", (socket) => {
    console.log(`[Socket] Client connected: ${socket.id} (User: ${socket.data.userId})`);

    socket.on("subscribe", (data) => {
      if (typeof data.channel === "string") {
        socket.join(`channel_${data.channel}`);
        console.log(`[Socket] ${socket.id} joined channel_${data.channel}`);
        // Optional: acknowledge subscription
        socket.emit("subscribed", { channel: data.channel });
      }
    });

    socket.on("unsubscribe", (data) => {
      if (typeof data.channel === "string") {
        socket.leave(`channel_${data.channel}`);
        console.log(`[Socket] ${socket.id} left channel_${data.channel}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
}
