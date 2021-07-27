import * as http from "http";
import express from "express";
import hpp from "hpp";
import compression from "compression";
import cookieParser from "cookie-parser";
import Routes from "./interfaces/routes.interface";

import MSocket from "./socket";
import errorMiddleware from "./middlewares/error.middleware";

class App {
  public app: express.Application;
  public port: string | number;
  public env: string;
  public httpServer!: http.Server;
  public socketServer!: MSocket;

  constructor(routes: Routes[]) {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV || "development";
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.httpServer = http.createServer(this.app);
    this.socketServer = new MSocket(this.httpServer);
    this.socketServer.init();
    this.socketServer.onUpgrade();
    this.httpServer.listen(this.port);
  }

  private initializeMiddlewares() {
    // production or dev 분기 처리 필요

    // if (this.env === 'production') {
    //   this.app.use(morgan('combined', { stream }));
    //   this.app.use(cors({ origin: 'mommoss.com', credentials: true }));
    // } else if (this.env === 'development') {
    //   this.app.use(morgan('dev', { stream }));
    //   this.app.use(cors({ origin: true, credentials: true }));
    // }

    this.app.use(hpp());
    // this.env === 'production' && this.app.use(helmet());
    this.app.use(compression()); //NginX 이용시 필요없음
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach((route) => {
      this.app.use("/api/", route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
export default App;
