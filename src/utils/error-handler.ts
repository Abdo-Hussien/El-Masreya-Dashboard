import { NextResponse } from "next/server";
import { BaseError } from "./errors";
import { Logger } from "./logger";

export function handleError(err: any) {
    let status = 500;
    let responseBody: any = {
        code: 500,
        message: "Internal Server Error",
        description: "An unexpected error occurred",
        timestamp: new Date().toISOString(),
    };

    if (err instanceof BaseError) {
        status = err.code;
        responseBody = err.toJSON();
    } else if (err instanceof Error) {
        responseBody.message = err.message;
    }

    // Log for server-side debugging
    Logger.error(`Error: ${responseBody.message}`, { status, ...responseBody });
    Logger.traceError(err);

    return NextResponse.json(responseBody, { status });
}
