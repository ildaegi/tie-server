import { NextFunction, Request, Response } from "express";

import { ErrorResponse } from "../interfaces/response.interface";
import HttpException from "../exceptions/httpException";

const errorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status: number = error.status || 500;
    const message: string = error.message || "Something went wrong";
    const data: ErrorResponse = {
      result: false,
      reason: message,
    };

    res.status(status).json({ ...data });
  } catch (error) {
    // next(error);
    console.log(error);
  }
};

export default errorMiddleware;
