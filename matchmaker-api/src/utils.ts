import {createHash} from "crypto";
import {Request} from "express";

/**
 * Generate a "unique" user footprint.
 * Hash for security.
 */
export function hashUser(req: Request): string {
    const data = {
        "ip": req.ip,
        "user-agent": req.headers["user-agent"],
    };
    return createHash("md5")
        .update(JSON.stringify(data))
        .digest("hex").toString();
}
