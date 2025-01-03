import type { IGameBoard } from './game_board.ts';
import type { IGameSession } from './game_session.ts';
import type { IPlayerMove } from './player_move.ts';

export interface IPlayerOptions {
    readonly playerInitial: string;

    readonly seed: number;
}

export interface IPlayer extends IPlayerOptions {
    computePlayerMove(
        gameSession: IGameSession,
        gameBoard: IGameBoard,
    ): Promise<IPlayerMove | null>;

    destroy(): Promise<void>;

    initialize(): Promise<void>;
}

export type IPlayerConstructor = (options: IPlayerOptions) => IPlayer;
