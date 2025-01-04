import type { IGameBoard, IGameSession, IPlayer } from '../engine/mod.ts';

export interface IGameNamespaceOptions {
    readonly gameBoard: IGameBoard;

    readonly gameSession: IGameSession;

    readonly player: IPlayer;
}

export interface IGameNamespace {
    readonly board: IGameBoard;

    readonly session: IGameSession;

    readonly player: IPlayer;
}

export function makeGameNamespace(
    options: IGameNamespaceOptions,
): IGameNamespace {
    const { gameBoard, gameSession, player } = options;

    return Object.freeze({
        board: gameBoard,
        session: gameSession,
        player,
    });
}
