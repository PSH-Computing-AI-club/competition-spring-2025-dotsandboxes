import type { IPlayer, IPlayerConstructor, IPlayerOptions } from './player.ts';

export interface IConstantPlayerOptions extends IPlayerOptions {
    readonly x: number;

    readonly y: number;
}

export type IConstantPlayer = IPlayer & IConstantPlayerOptions;

export const makeConstantPlayer =
    ((options: IConstantPlayerOptions): IConstantPlayer => {
        const { playerInitial, seed, x, y } = options;

        return {
            playerInitial,
            seed,
            x,
            y,

            async computePlayerMove() {
                return {
                    x,
                    y,
                };
            },

            toString() {
                return 'constant_player';
            },
        };
    }) satisfies IPlayerConstructor<IConstantPlayerOptions, IConstantPlayer>;
