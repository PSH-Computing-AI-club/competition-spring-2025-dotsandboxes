import type { IGameBoard, IGameSession } from '../engine/mod.ts';

export interface IGameNamespaceOptions {
    readonly gameBoard: IGameBoard;

    readonly gameSession: IGameSession;
}

export interface IGameNamespace {
    readonly board: IGameBoard;

    readonly session: IGameSession;
}

export function makeGameNamespace(
    options: IGameNamespaceOptions,
): IGameNamespace {
    const { gameBoard, gameSession } = options;

    return Object.freeze({
        board: gameBoard,
        session: gameSession,
    });
}
