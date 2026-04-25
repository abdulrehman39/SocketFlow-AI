import { io, Socket } from "socket.io-client";

export interface SocketFlowOptions {
  url: string;
  token: string;
}

export class SocketFlowClient {
  private socket: Socket;
  private listeners: Record<string, Function[]> = {};

  constructor(options: SocketFlowOptions) {
    this.socket = io(options.url, {
      auth: { token: options.token },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      this.emitEvent("connected");
    });

    this.socket.on("disconnect", (reason) => {
      this.emitEvent("disconnected", reason);
    });

    this.socket.on("connect_error", (error) => {
      this.emitEvent("error", error);
    });
  }

  public subscribe(channel: string, callback: (message: any) => void) {
    this.socket.emit("subscribe", { channel });
    
    const listener = (data: any) => {
      if (data.channel === channel) {
        callback(data);
      }
    };
    
    this.socket.on("message", listener);
    
    (this as any)[`_listener_${channel}`] = listener;
  }

  public unsubscribe(channel: string) {
    this.socket.emit("unsubscribe", { channel });
    const listener = (this as any)[`_listener_${channel}`];
    if (listener) {
      this.socket.off("message", listener);
      delete (this as any)[`_listener_${channel}`];
    }
  }

  public on(event: "connected" | "disconnected" | "error", callback: Function) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  private emitEvent(event: string, ...args: any[]) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(...args));
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }
}
