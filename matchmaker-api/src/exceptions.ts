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
