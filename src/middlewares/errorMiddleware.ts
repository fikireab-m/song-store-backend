import { Response, Request, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`Not Found = ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError') {
        statusCode = 404;
        message = 'Resource not found';
    }
    res.status(statusCode).send(message);
}
