import {NextFunction, Request, Response} from "express-serve-static-core";
import {NotFoundException, UnauthorizedException, ValidationError} from "../exceptions";

export default function exceptionMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
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
