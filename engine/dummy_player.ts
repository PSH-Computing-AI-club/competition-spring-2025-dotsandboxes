import { NotImplementedError } from '../util/mod.ts';

import type { IPlayer, IPlayerConstructor, IPlayerOptions } from './player.ts';

export type IDummyPlayerOptions = IPlayerOptions;

export type IDummyPlayer = IPlayer;

export const makeDummyPlayer =
    ((options: IDummyPlayerOptions): IDummyPlayer => {
        const { playerInitial, seed } = options;

        return {
            playerInitial,
            seed,

            async computePlayerMove() {
                throw new NotImplementedError(
                    "bad dispatch to 'IDummyPlayer.computePlayerMove' (not implemented)",
                );
            },

            toString() {
                return 'builtin:dummy_player';
            },
        };
    }) satisfies IPlayerConstructor<IDummyPlayerOptions, IDummyPlayer>;
