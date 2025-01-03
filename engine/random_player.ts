import { randomSeeded, sample } from '@std/random';

import { SLOT_KIND } from './game_board_slot.ts';
import type { IPlayer, IPlayerConstructor, IPlayerOptions } from './player.ts';

export type IRandomPlayerOptions = IPlayerOptions;

export type IRandomPlayer = IPlayer;

export const makeRandomPlayer =
    ((options: IRandomPlayerOptions): IRandomPlayer => {
        const { playerInitial, seed } = options;

        const prng = randomSeeded(BigInt(seed));

        return {
            playerInitial,
            seed,

            async destroy() {},
            async initialize() {},

            async computePlayerMove(_gameSession, gameBoard) {
                const availableSpacers = Array.from(gameBoard.walkSpacers())
                    .filter(
                        (gameBoardSlot) =>
                            gameBoardSlot.slotKind === SLOT_KIND.spacer,
                    );

                const gameBoardSlot = sample(availableSpacers, { prng });

                if (gameBoardSlot === undefined) return null;

                const { x, y } = gameBoardSlot;

                return {
                    x,
                    y,
                };
            },
        };
    }) satisfies IPlayerConstructor;
