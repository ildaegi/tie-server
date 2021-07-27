import * as http from "http";
import WebSocket from "ws";
import { Socket } from "net";

class MSocket {
  private readonly httpServer: http.Server;
  private readonly server: WebSocket.Server;

  constructor(httpServer: http.Server) {
    this.httpServer = httpServer;
    this.server = new WebSocket.Server({
      path: "/chat",
      noServer: true,
    });
  }

  init() {}

  onUpgrade(): void {
    this.httpServer.on(
      "upgrade",
      (req: http.IncomingMessage, socket: Socket, head: Buffer) => {
        const pathname = req.url;

        switch (pathname) {
          case "/chat":
            this.validateClient(req, socket, head);
            break;

          default:
            socket.destroy();
            break;
        }
      }
    );
  }

  private bindServerEvent(
    event: string,
    callback: (ws: WebSocket, req: http.IncomingMessage, args?: any) => any
  ): void {
    this.server.on(event, callback);
  }
}

export default MSocket;
