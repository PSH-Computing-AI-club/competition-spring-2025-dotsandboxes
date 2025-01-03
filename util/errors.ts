export class NotImplementedError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);

        this.name = NotImplementedError.name;
    }
}

export class SubscriptionExistsError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);

        this.name = SubscriptionExistsError.name;
    }
}

export class TimeoutError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);

        this.name = TimeoutError.name;
    }
}
