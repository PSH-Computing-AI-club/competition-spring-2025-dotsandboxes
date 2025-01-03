import type { IPlayer, IPlayerConstructor, IPlayerOptions } from './player.ts';

export type IForfeitPlayerOptions = IPlayerOptions;

export type IForfeitPlayer = IPlayer;

export const makeForfeitPlayer =
    ((options: IForfeitPlayerOptions): IForfeitPlayer => {
        const { playerInitial, seed } = options;

        return {
            playerInitial,
            seed,

            async computePlayerMove() {
                return null;
            },
        };
    }) satisfies IPlayerConstructor;
