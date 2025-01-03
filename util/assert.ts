import { AssertionError } from '@std/assert';

/**
 * Represents all the types returnable by the `typeof` operator.
 */
type BuiltinTypes =
    | 'bigint'
    | 'boolean'
    | 'function'
    | 'number'
    | 'object'
    | 'string'
    | 'symbol'
    | 'undefined';

export function assert(condition: boolean, error: Error) {
    if (!condition) {
        throw error;
    }
}

/**
 * Make an assertion that `actual` has the type of `expected_type`.
 * If not then throw.
 *
 * @param actual
 * @param expected_type
 * @param message
 * @returns
 *
 * @example
 * ```typescript
 * import { assertTypeOf } from '...directory.../util/mod.ts';
 *
 * assertTypeOf('Hello World!', 'string');
 * ```
 */
export function assertTypeOf(
    actual: unknown,
    expected_type: BuiltinTypes,
    message = '',
): boolean {
    const actual_type = typeof actual;
    if (actual_type === expected_type) return true;

    const message_suffix = message ? `: ${message}` : '.';

    throw new AssertionError(
        `Expected actual: ${actual} to be of type ${expected_type} not to be: ${actual_type}${message_suffix}`,
    );
}
