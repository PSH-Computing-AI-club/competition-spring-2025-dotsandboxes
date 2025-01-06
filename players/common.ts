// Common utility functions are found here.

export function sampleArray<T>(array: T[]): T | null {
    const elementIndex = Math.trunc(
        (array.length - 1) * Math.random(),
    );

    return array[elementIndex] ?? null;
}
