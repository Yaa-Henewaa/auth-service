export default class CustomError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string, cause?: Error) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }

    toJSON(): object {
        return {
            message: this.message,
        };
    }

    toString(): string {
        return `[CustomError statusCode=${this.statusCode} message=${this.message}]`;
    }
}
