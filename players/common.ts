// Common utility functions are found here.

export function sampleArray<T>(array: T[]): T | null {
    const elementIndex = Math.trunc(Math.random() * array.length);

    return array[elementIndex] ?? null;
}
