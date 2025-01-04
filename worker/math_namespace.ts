// **HACK:** All of this... just to provide a pre-seeded random number generator!

import { randomSeeded } from '@std/random/seeded';

export type IMathNamespace = Omit<Math, typeof Symbol['toStringTag']>;

export interface IMathNamespaceOptions {
    readonly seed: number;
}

export function makeMathNamespace(
    options: IMathNamespaceOptions,
): IMathNamespace {
    const { seed } = options;

    const prng = randomSeeded(BigInt(seed));

    const {
        E,
        LN10,
        LN2,
        LOG10E,
        LOG2E,
        PI,
        SQRT1_2,
        SQRT2,

        abs,
        acos,
        acosh,
        asin,
        asinh,
        atan,
        atan2,
        atanh,
        cbrt,
        ceil,
        clz32,
        cos,
        cosh,
        exp,
        expm1,
        floor,
        fround,
        hypot,
        imul,
        log,
        log10,
        log1p,
        log2,
        max,
        min,
        pow,
        round,
        sign,
        sin,
        sinh,
        sqrt,
        tan,
        tanh,
        trunc,
    } = Math;

    return Object.freeze({
        E,
        LN10,
        LN2,
        LOG10E,
        LOG2E,
        PI,
        SQRT1_2,
        SQRT2,

        abs,
        acos,
        acosh,
        asin,
        asinh,
        atan,
        atan2,
        atanh,
        cbrt,
        ceil,
        clz32,
        cos,
        cosh,
        exp,
        expm1,
        floor,
        fround,
        hypot,
        imul,
        log,
        log10,
        log1p,
        log2,
        max,
        min,
        pow,
        round,
        sign,
        sin,
        sinh,
        sqrt,
        tan,
        tanh,
        trunc,

        random: prng,
    });
}
