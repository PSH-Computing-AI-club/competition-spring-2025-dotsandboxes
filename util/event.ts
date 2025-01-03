import { SubscriptionExistsError } from './errors.ts';

/**
 * Represents the callback supplied by subscribers to be called every dispatch.
 */
export type IEventCallback<T> = (value: T) => void;

export interface IEventSubscription<T> {
    readonly callback: IEventCallback<T>;

    destroy(): void;
}

/**
 * Represents an interface to publish event data via a singleton instance, that is compatible with Svelte Store subscriptions.
 */
export interface IEvent<T> {
    /**
     * Dispatches new event details to every subscriber
     * @param details
     */
    dispatch(details: T): void;

    /**
     * Subscribes to new incoming event dispatches.
     * @param callback
     * @returns
     */
    subscribe(callback: IEventCallback<T>): IEventSubscription<T>;
}

/**
 * Returns a new [[IEvent]] instance, for handling event publishing in non-DOM related contexts.
 *
 * @param start
 * @returns
 *
 * @example
 * ```typescript
 * import {event} from "...directory.../util/mod.ts";
 *
 * ...
 * ```
 */
export function event<T>(): IEvent<T> {
    const subscribers: Set<IEventCallback<T>> = new Set();

    return {
        dispatch(details) {
            for (const callback of subscribers) callback(details);
        },

        subscribe(callback) {
            if (subscribers.has(callback)) {
                throw new SubscriptionExistsError(
                    `bad argument #0 to 'IEvent.subscribe' (function '${callback}' was already subscribed)`,
                );
            }

            subscribers.add(callback);

            return {
                callback,

                destroy() {
                    subscribers.delete(callback);
                },
            };
        },
    };
}
