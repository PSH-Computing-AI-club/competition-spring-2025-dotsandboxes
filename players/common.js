// Common utility functions are found here.

export function sampleArray(array) {
    const elementIndex = Math.trunc(Math.random() * array.length);

    return array[elementIndex] ?? null;
}
