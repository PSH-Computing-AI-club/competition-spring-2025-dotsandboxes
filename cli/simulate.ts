import { Command } from '@cliffy/command';

import type { IPlayerTurn } from '../engine/mod.ts';
import {
    computeGameResultFromGame,
    InvalidPlacementError,
    makeGameBoard,
    makeGameSession,
    PlayerComputeThrowError,
} from '../engine/mod.ts';
import { makeRandomPlayer } from '../engine/random_player.ts';

import type { IGlobalOptions } from './global.ts';
import { makeGameLogger } from './game_logger.ts';
import { PlayerForfeitError } from '../engine/errors.ts';

interface ISimulateOptions extends IGlobalOptions {
    readonly gridColumns: number;

    readonly gridRows: number;

    readonly seed: number;

    readonly timeout: number;
}

export const COMMAND_SIMULATE = new Command()
    .description('Simulates a Dots and Boxes game session.')
    .option(
        '--grid-columns [columns:number]',
        'Determine how many columns of dots is in gameboard.',
        { default: 5 },
    )
    .option(
        '--grid-rows [rows:number]',
        'Determine how many rows of dots is in gameboard.',
        { default: 3 },
    ).option(
        '--seed [seed:number]',
        'Determine what value to initially seed random number generators with.',
        { default: Date.now() },
    ).option(
        '--timeout [timeout:number]',
        'Determine how long in milliseconds should each player get to compute their turns.',
        { default: 1000 },
    ).action(
        async (
            options: ISimulateOptions,
        ) => {
            const { gridColumns, gridRows, outputKind, seed, timeout } =
                options;

            const playerA = makeRandomPlayer({ playerInitial: 'A', seed });
            const playerB = makeRandomPlayer({ playerInitial: 'B', seed });

            const gameBoard = makeGameBoard({
                columns: gridColumns,
                rows: gridRows,
            });

            const gameSession = makeGameSession({
                players: [playerA, playerB],
                timeout,
            });

            const gameLogger = makeGameLogger({
                gameBoard,
                gameSession,
                outputKind,
            });

            gameLogger.startSession();

            while (gameBoard.remainingBoxes > 0) {
                try {
                    await gameSession.applyNextPlayerTurn(
                        gameBoard,
                    );
                } catch (error) {
                    if (
                        error instanceof InvalidPlacementError ||
                        error instanceof PlayerComputeThrowError ||
                        error instanceof PlayerForfeitError
                    ) {
                        break;
                    }

                    throw error;
                }
            }

            const gameResult = computeGameResultFromGame(
                gameSession,
                gameBoard,
            );

            gameLogger.endSession(gameResult);
            gameLogger.destroy();
        },
    );
