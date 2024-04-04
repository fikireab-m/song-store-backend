import { Response, Request, NextFunction } from "express";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    const error = new Error(`route not found => ${req.originalUrl}`);
    res.status(404);
    next(error);
}

export const errorHandler = (err: Error, req: Request, res: Response) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message
    if (err.name === 'CastError' && err.stack === 'ObjectId') {
        statusCode = 404;
        message = 'Resource not found';
    }
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
}