// **NOTE:** We want to provide a close-as-possible compliant Deno / Web API environment
// for the player developers. Even if they have no reason to use those features.
//
// This makes sure that the player developers know to expect a degree of compatibility
// with other JS runtimes.

import type { IEngineNamespace } from './engine_namespace.ts';
import type { IGameNamespace } from './game_namespace.ts';
import type { IMathNamespace } from './math_namespace.ts';

export interface IWorkerGlobalThisOptions {
    readonly Engine: IEngineNamespace;

    readonly Game: IGameNamespace;

    readonly Math: IMathNamespace;
}

export interface IWorkerGlobalThis {
    readonly Game: IGameNamespace;
    readonly Engine: IEngineNamespace;

    readonly globalThis: IWorkerGlobalThis;

    readonly Infinity: typeof Infinity;
    readonly NaN: typeof NaN;

    readonly Math: IMathNamespace;

    readonly AggregateError: typeof AggregateError;
    readonly Error: typeof Error;
    readonly RangeError: typeof RangeError;
    readonly ReferenceError: typeof ReferenceError;
    readonly TypeError: typeof TypeError;

    readonly Array: typeof Array;
    readonly Boolean: typeof Boolean;
    readonly Date: typeof Date;
    readonly RegExp: typeof RegExp;
    readonly Map: typeof Map;
    readonly Number: typeof Number;
    readonly Object: typeof Object;
    readonly Proxy: typeof Proxy;
    readonly Set: typeof Set;
    readonly String: typeof String;
    readonly Symbol: typeof Symbol;
    readonly WeakMap: typeof WeakMap;
    readonly WeakRef: typeof WeakRef;
    readonly WeakSet: typeof WeakSet;

    readonly clearInterval: typeof clearInterval;
    readonly clearTimeout: typeof clearTimeout;
    readonly performance: typeof performance;
    readonly queueMicrotask: typeof queueMicrotask;
    readonly setTimeout: typeof setTimeout;
    readonly structuredClone: typeof structuredClone;

    readonly isFinite: typeof isFinite;
    readonly isNaN: typeof isNaN;
    readonly parseFloat: typeof parseFloat;
    readonly parseInt: typeof parseInt;
}

export function makeWorkerGlobalThis(
    options: IWorkerGlobalThisOptions,
): IWorkerGlobalThis {
    const { Engine, Game, Math } = options;

    const globalThis = {
        Game,
        Engine,

        Infinity,
        NaN,

        Math,

        AggregateError,
        Error,
        RangeError,
        ReferenceError,
        TypeError,

        Array,
        Boolean,
        Date,
        RegExp,
        Map,
        Number,
        Object,
        Proxy,
        Set,
        String,
        Symbol,
        WeakMap,
        WeakRef,
        WeakSet,

        clearInterval,
        clearTimeout,
        performance,
        queueMicrotask,
        setTimeout,
        structuredClone,

        isFinite,
        isNaN,
        parseFloat,
        parseInt,
    } satisfies Omit<IWorkerGlobalThis, 'globalThis'>;

    Object.assign(globalThis, {
        globalThis,
    });

    return Object.freeze(globalThis) as IWorkerGlobalThis;
}
