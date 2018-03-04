/**
 * Express.js session, storing all information required by service layer.
 *
 * Works like a Java's `ThreadLocal`.
 * Based on NodeJS "Continuation-Local Storage" technology.
 */

import {createNamespace} from "cls-hooked";
import {NextFunction, Request, Response} from "express";

const namespace = createNamespace("matchmaker");

/** Session key. */
const LOCALE = "locale";

export function currentLocale(): string | null {
    return namespace.get(LOCALE);
}

export function sessionMiddleware(err: any, req: Request, res: Response, next: NextFunction) {
    namespace.bindEmitter(req);
    namespace.bindEmitter(res);
    namespace.run(() => {
        namespace.set(LOCALE, req.headers["Accept-Language"]);
        next();
    });
}
