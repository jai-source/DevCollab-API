import {Request , Response , NextFunction} from 'express';

export const rateLimmeter = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    next();
};