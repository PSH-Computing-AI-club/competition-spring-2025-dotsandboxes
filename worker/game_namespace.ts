import type { IGameBoard, IGameSession } from '../engine/mod.ts';

export interface IGameNamespaceOptions {
    readonly board: IGameBoard;

    readonly session: IGameSession;
}

export interface IGameNamespace {
    readonly board: IGameBoard;

    readonly session: IGameSession;
}

export function makeGameNamespace(
    options: IGameNamespaceOptions,
): IGameNamespace {
    const { board, session } = options;

    return Object.freeze({
        board,
        session,
    });
}
