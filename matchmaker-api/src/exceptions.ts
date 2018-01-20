import {NextFunction, Request, Response} from "express-serve-static-core";

/**
 * When user try to execute a limited action.
 * @example Too many proposition sent.
 * @example Try to delete another user's proposition.
 */
export class UnauthorizedException extends Error {
}

/**
 * @example Unknown "id" value.
 */
export class NotFoundException extends Error {
}

export class ValidationError extends Error {
}

export function exceptionHandler(err: any, req: Request, res: Response, next: NextFunction) {
    switch (err.constructor) {
        case UnauthorizedException:
            res.status(401).send(err);
            break;
        case NotFoundException:
            res.status(404).send(err);
            break;
        case ValidationError:
            res.status(422).send(err);
            break;
        default:
            res.status(500).send(err);
            break;
    }
    next(err);
}
