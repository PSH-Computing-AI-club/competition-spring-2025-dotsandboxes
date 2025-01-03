import type { ValueOf } from '../util/mod.ts';

import type { IGameBoard } from './game_board.ts';
import { SLOT_KIND } from './game_board_slot.ts';
import type { IGameSession } from './game_session.ts';
import type { IPlayer } from './player.ts';

export const WIN_KIND = {
    undefined: 'WIN_UNDEFINED',

    no_contest: 'WIN_NO_CONTEST',

    singular: 'WIN_SINGULAR',

    multiple: 'WIN_MULTIPLE',
} as const;

export type WinKind = ValueOf<typeof WIN_KIND>;

export interface IGameResultOptions {
    readonly scores: ReadonlyMap<IPlayer, number>;
}

export interface IGameResult extends IGameResultOptions {
    readonly highestScore: number;

    readonly winKind: WinKind;

    readonly winningPlayers: ReadonlySet<IPlayer>;
}

export function makeGameResult(options: IGameResultOptions): IGameResult {
    const { scores } = options;

    let highestScore = 0;
    const sortedScoreEntries = Array.from(scores.entries()).toSorted(
        ([playerA, _scoreA], [playerB, _scoreB]) => {
            const playerInitialA = playerA.playerInitial.toLowerCase();
            const playerInitialB = playerB.playerInitial.toLowerCase();

            return playerInitialB > playerInitialA ? -1 : 0;
        },
    );

    for (const [_player, score] of sortedScoreEntries) {
        if (score > highestScore) highestScore = score;
    }

    const winningPlayers = new Set<IPlayer>();

    if (highestScore > 0) {
        for (const [player, score] of sortedScoreEntries) {
            if (score === highestScore) winningPlayers.add(player);
        }
    }

    let winKind: WinKind = WIN_KIND.no_contest;
    if (highestScore > 0) {
        winKind = winningPlayers.size > 1
            ? WIN_KIND.multiple
            : WIN_KIND.singular;
    }

    return {
        highestScore,
        scores: new Map(sortedScoreEntries),
        winKind,
        winningPlayers,
    };
}

export function computeGameResultFromGame(
    gameSession: IGameSession,
    gameBoard: IGameBoard,
): IGameResult {
    const scores = new Map<IPlayer, number>();

    for (const player of gameSession.players) {
        scores.set(player, 0);
    }

    for (const gameBoardSlot of gameBoard.walkBoxes()) {
        if (gameBoardSlot.slotKind !== SLOT_KIND.initial) continue;

        const { player } = gameBoardSlot.playerTurn;
        const score = scores.get(player);

        if (score !== undefined) scores.set(player, score + 1);
    }

    return makeGameResult({
        scores,
    });
}
