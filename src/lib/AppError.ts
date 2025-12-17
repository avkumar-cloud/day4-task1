import { ErrorCode } from "./errorCodes";

export class AppError extends Error {
  statusCode: number;
  code: ErrorCode;

  constructor(
    code: ErrorCode,
    message: string,
    statusCode = 400
  ) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}
