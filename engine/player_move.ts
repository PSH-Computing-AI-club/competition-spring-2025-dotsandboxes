import { assert } from '../util/mod.ts';

export interface IPlayerMove {
    readonly x: number;

    readonly y: number;
}

export function isLegalMove(x: number, y: number): boolean {
    return (x % 2 === 0 && y % 2 === 1) || (x % 2 === 1 && y % 2 === 0);
}

export function makePlayerMove(options: IPlayerMove): IPlayerMove {
    const { x, y } = options;

    assert(
        isLegalMove(x, y),
        new Error(
            "bad argument #0 to 'makePlayerMove' (fields `IPlayerMove.x' and 'IPlayerMove.y' must have opposite parities)",
        ),
    );

    return {
        x,
        y,
    };
}
