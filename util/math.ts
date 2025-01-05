export function truncate(number: number, precision: number) {
    const factor = 10 ** precision;

    return Math.trunc(number * factor) / factor;
}
