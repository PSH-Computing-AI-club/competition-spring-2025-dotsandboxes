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
    readonly self: IWorkerGlobalThis;
    readonly window: IWorkerGlobalThis;

    readonly Atomics: Atomics;
    readonly crypto: typeof crypto;
    readonly Intl: typeof Intl;
    readonly Reflect: typeof Reflect;
    readonly Math: IMathNamespace;
    readonly JSON: JSON;

    readonly AggregateError: typeof AggregateError;
    readonly Error: typeof Error;
    readonly DOMException: typeof DOMException;
    readonly EvalError: typeof EvalError;
    readonly RangeError: typeof RangeError;
    readonly ReferenceError: typeof ReferenceError;
    readonly SyntaxError: typeof SyntaxError;
    readonly TypeError: typeof TypeError;
    readonly URIError: typeof URIError;

    readonly Array: typeof Array;
    readonly ArrayBuffer: typeof ArrayBuffer;
    readonly AbortController: typeof AbortController;
    readonly AbortSignal: typeof AbortSignal;
    readonly BigInt: typeof BigInt;
    readonly BigInt64Array: typeof BigInt64Array;
    readonly BigUint64Array: typeof BigUint64Array;
    readonly Blob: typeof Blob;
    readonly Boolean: typeof Boolean;
    readonly CompressionStream: typeof CompressionStream;
    readonly Date: typeof Date;
    readonly DataView: typeof DataView;
    readonly DecompressionStream: typeof DecompressionStream;
    readonly ByteLengthQueuingStrategy: typeof ByteLengthQueuingStrategy;
    readonly CountQueuingStrategy: typeof CountQueuingStrategy;
    readonly CustomEvent: typeof CustomEvent;
    readonly Event: typeof Event;
    readonly EventTarget: typeof EventTarget;
    readonly Int16Array: typeof Int16Array;
    readonly Int32Array: typeof Int32Array;
    readonly Int8Array: typeof Int8Array;
    readonly Map: typeof Map;
    readonly Number: typeof Number;
    readonly Object: typeof Object;
    readonly Promise: typeof Promise;
    readonly Proxy: typeof Proxy;
    readonly RegExp: typeof RegExp;
    readonly ReadableByteStreamController: typeof ReadableByteStreamController;
    readonly ReadableStream: typeof ReadableStream;
    readonly ReadableStreamBYOBReader: typeof ReadableStreamBYOBReader;
    readonly ReadableStreamBYOBRequest: typeof ReadableStreamBYOBRequest;
    readonly ReadableStreamDefaultController:
        typeof ReadableStreamDefaultController;
    readonly ReadableStreamDefaultReader: typeof ReadableStreamDefaultReader;
    readonly Set: typeof Set;
    readonly String: typeof String;
    readonly Symbol: typeof Symbol;
    readonly TextDecoder: typeof TextDecoder;
    readonly TextDecoderStream: typeof TextDecoderStream;
    readonly TextEncoder: typeof TextEncoder;
    readonly TextEncoderStream: typeof TextEncoderStream;
    readonly TransformStream: typeof TransformStream;
    readonly TransformStreamDefaultController:
        typeof TransformStreamDefaultController;
    readonly Uint8Array: typeof Uint8Array;
    readonly Uint16Array: typeof Uint16Array;
    readonly Uint32Array: typeof Uint32Array;
    readonly Uint8ClampedArray: typeof Uint8ClampedArray;
    readonly URL: typeof URL;
    readonly URLPattern: typeof URLPattern;
    readonly URLSearchParams: typeof URLSearchParams;
    readonly WeakMap: typeof WeakMap;
    readonly WeakRef: typeof WeakRef;
    readonly WeakSet: typeof WeakSet;
    readonly WritableStream: typeof WritableStream;
    readonly WritableStreamDefaultController:
        typeof WritableStreamDefaultController;
    readonly WritableStreamDefaultWriter: typeof WritableStreamDefaultWriter;

    readonly atob: typeof atob;
    readonly btoa: typeof btoa;
    readonly clearInterval: typeof clearInterval;
    readonly clearTimeout: typeof clearTimeout;
    readonly performance: typeof performance;
    readonly queueMicrotask: typeof queueMicrotask;
    readonly setTimeout: typeof setTimeout;
    readonly structuredClone: typeof structuredClone;

    readonly decodeURI: typeof decodeURI;
    readonly decodeURIComponent: typeof decodeURIComponent;
    readonly encodeURI: typeof encodeURI;
    readonly encodeURIComponent: typeof encodeURIComponent;
    readonly parseFloat: typeof parseFloat;
    readonly parseInt: typeof parseInt;
    readonly isNaN: typeof isNaN;
}

export function makeWorkerGlobalThis(
    options: IWorkerGlobalThisOptions,
): IWorkerGlobalThis {
    const { Engine, Game, Math } = options;

    const globalThis = {
        onComputePlayerTurn: null,

        Game,
        Engine,

        Atomics,
        crypto,
        Intl,
        Reflect,
        Math,
        JSON,

        AggregateError,
        Error,
        DOMException,
        EvalError,
        RangeError,
        ReferenceError,
        SyntaxError,
        TypeError,
        URIError,

        Array,
        ArrayBuffer,
        AbortController,
        AbortSignal,
        BigInt,
        BigInt64Array,
        BigUint64Array,
        Blob,
        Boolean,
        CompressionStream,
        Date,
        DataView,
        DecompressionStream,
        ByteLengthQueuingStrategy,
        CountQueuingStrategy,
        CustomEvent,
        Event,
        EventTarget,
        Int16Array,
        Int32Array,
        Int8Array,
        Map,
        Number,
        Object,
        Promise,
        Proxy,
        RegExp,
        ReadableByteStreamController,
        ReadableStream,
        ReadableStreamBYOBReader,
        ReadableStreamBYOBRequest,
        ReadableStreamDefaultController,
        ReadableStreamDefaultReader,
        Set,
        String,
        Symbol,
        TextDecoder,
        TextDecoderStream,
        TextEncoder,
        TextEncoderStream,
        TransformStream,
        TransformStreamDefaultController,
        Uint8Array,
        Uint16Array,
        Uint32Array,
        Uint8ClampedArray,
        URL,
        URLPattern,
        URLSearchParams,
        WeakMap,
        WeakRef,
        WeakSet,
        WritableStream,
        WritableStreamDefaultController,
        WritableStreamDefaultWriter,

        atob,
        btoa,
        clearInterval,
        clearTimeout,
        performance,
        queueMicrotask,
        setTimeout,
        structuredClone,

        decodeURI,
        decodeURIComponent,
        encodeURI,
        encodeURIComponent,
        parseFloat,
        parseInt,
        isNaN,
    } as Omit<IWorkerGlobalThis, 'globalThis' | 'self' | 'window'>;

    Object.assign(globalThis, {
        globalThis,
        self: globalThis,
        window: globalThis,
    });

    return Object.freeze(globalThis) as IWorkerGlobalThis;
}
