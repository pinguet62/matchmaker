import {registerDecorator, ValidationArguments, ValidationOptions} from "class-validator";
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

// TODO remove after "class-validator" upgrade
export function IsInstance(targetType: new (...args: any[]) => any, validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            constraints: [targetType],
            name: "isInstance",
            options: validationOptions,
            propertyName,
            target: object.constructor,
            validator: {
                validate(value: any, valicationArguments: ValidationArguments) {
                    if (validationOptions && validationOptions.each) {
                        return value.every((item) => item instanceof targetType);
                    } else {
                        return value instanceof targetType;
                    }
                },
            },
        });
    };
}
