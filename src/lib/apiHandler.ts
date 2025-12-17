import { NextRequest, NextResponse } from "next/server";
import { AppError } from "./AppError";
import { ERROR_CODES } from "./errorCodes";

export function apiHandler(
  fn: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: Request) => {
    try {
      return await fn(req);
    } catch (err: any) {
      // Known app error
      if (err instanceof AppError) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: err.code,
              message: err.message,
            },
          },
          { status: err.statusCode }
        );
      }

      // Unknown error
      console.error("UNHANDLED ERROR:", err);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: ERROR_CODES.INTERNAL_SERVER_ERROR,
            message: "Something went wrong",
          },
        },
        { status: 500 }
      );
    }
  };
}
