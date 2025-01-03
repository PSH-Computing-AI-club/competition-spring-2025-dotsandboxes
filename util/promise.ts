import { TimeoutError } from './errors.ts';

export function timeout<T extends unknown>(
    promise: Promise<T>,
    duration: number,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const timeoutIdentifier = setTimeout(() => {
            reject(
                new TimeoutError(
                    "bad argument #0 to 'timeout' (promise timed out)",
                ),
            );
        }, duration);

        promise
            .then((value) => {
                clearTimeout(timeoutIdentifier);
                resolve(value);
            }).catch((error) => {
                clearTimeout(timeoutIdentifier);
                reject(error);
            });
    });
}
