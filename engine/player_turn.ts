import type { IPlayer } from './player.ts';
import type { IPlayerMove } from './player_move.ts';

export interface IPlayerTurn extends IPlayerMove {
    readonly player: IPlayer;

    readonly turnIndex: number;
}

export function makePlayerTurn(options: IPlayerTurn): IPlayerTurn {
    const { player, x, y, turnIndex } = options;

    return {
        player,
        x,
        y,
        turnIndex,
    };
}

export function makePlayerTurnFromPlayerMove(
    moveOptions: IPlayerMove,
    turnOptions: Omit<IPlayerTurn, keyof IPlayerMove>,
): IPlayerTurn {
    const { x, y } = moveOptions;
    const { player, turnIndex } = turnOptions;

    return {
        player,
        turnIndex,
        x,
        y,
    };
}
