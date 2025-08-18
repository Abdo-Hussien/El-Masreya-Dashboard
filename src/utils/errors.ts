export interface ErrorDetails {
    [key: string]: any
}

export class BaseError extends Error {
    public code: number
    public description: string
    public timestamp: string
    public details: ErrorDetails

    constructor(message: string, code = 500, description = "An error occurred", details: ErrorDetails = {}) {
        super(message)
        this.name = this.constructor.name
        this.code = code
        this.description = description
        this.timestamp = new Date().toISOString()
        this.details = details

        // Preserve stack trace (important for debugging)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor)
        }
    }

    toJSON() {
        return {
            code: this.code,
            message: this.message,
            description: this.description,
            timestamp: this.timestamp,
            ...this.details,
        }
    }
}

// Specific error classes
export class APIAuthError extends BaseError {
    constructor(message = "Authentication failed", errorType = "unauthorized", details: ErrorDetails = {}) {
        super(message, 401, "Authentication Error", { errorType, ...details })
    }
}

export class BadRequestError extends BaseError {
    constructor(message = "Invalid request parameters", validationErrors: string[] = [], requestData: ErrorDetails = {}) {
        super(message, 400, "Bad Request", { validationErrors, requestData })
    }
}

export class AccessDeniedError extends BaseError {
    constructor(message = "Access denied", details: ErrorDetails = {}) {
        super(message, 403, "Forbidden: You do not have the required permissions to access this resource.", details)
    }
}

export class ValidationError extends BaseError {
    constructor(message = "Validation failed", fieldErrors: Record<string, string> = {}, inputData: any = {}) {
        super(message, 422, "Validation Error", { fieldErrors, inputData })
    }
}

export class NotFoundError extends BaseError {
    constructor(message = "The requested resource was not found", resourceType?: string, resourceId?: any, details: ErrorDetails = {}) {
        super(message, 404, "Resource Not Found", { resourceType, resourceId, ...details })
    }
}

export class ConflictError extends BaseError {
    constructor(message = "Resource already exists", details: ErrorDetails = {}) {
        super(message, 409, "Conflict Error", details)
    }
}

export class DatabaseConnectionError extends BaseError {
    constructor(message = "Unable to establish database connection", dbName?: string, connectionParams: Record<string, string> = {}, retryAttempts = 0) {
        super(message, 500, "Database Connection Error", { dbName, connectionParams, retryAttempts })
    }
}

export class RateLimitError extends BaseError {
    constructor(message = "Rate limit exceeded", limit?: number, resetTime?: string, currentUsage?: number) {
        super(message, 429, "Too Many Requests", { limit, resetTime, currentUsage })
    }
}

export class ConfigurationError extends BaseError {
    constructor(message = "Invalid configuration detected", configKey?: string, expectedValue?: any, actualValue?: any) {
        super(message, 500, "Configuration Error", { configKey, expectedValue, actualValue })
    }
}

export class CrossServiceError extends BaseError {
    constructor(message = "Error communicating with another service", serviceName?: string, errorCode = 500, details: ErrorDetails = {}) {
        super(message, errorCode, "Cross-Service Communication Error", { serviceName, errorCode, ...details })
    }
}
