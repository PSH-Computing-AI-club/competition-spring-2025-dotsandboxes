import { Command } from '@cliffy/command';

import {
    computeGameResultFromGame,
    InvalidPlacementError,
    makeGameBoard,
    makeGameSession,
    makeWebWorkerPlayer,
    PlayerComputeThrowError,
    PlayerForfeitError,
    PlayerTimeoutError,
} from '../engine/mod.ts';

import type { IGlobalOptions } from './global.ts';
import { makeGameLogger } from './game_logger.ts';

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
        // @ts-expect-error - **HACK**: There's currently some weirdness with cliffy's
        // string to type parser causing types like `.gridColumns` being inferred as
        // `number | boolean` rather than just `number`.
        //
        // So we are manually ignoring the inferred typing to focus the actual behaviour.
        async (options: ISimulateOptions) => {
            const { gridColumns, gridRows, outputKind, seed, timeout } =
                options;

            const playerA = makeWebWorkerPlayer({ playerInitial: 'A', seed });
            const playerB = makeWebWorkerPlayer({ playerInitial: 'B', seed });

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

            await Promise.all([
                playerA.initialize({ gameBoard, gameSession }),
                playerB.initialize({ gameBoard, gameSession }),
            ]);

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
                        error instanceof PlayerForfeitError ||
                        error instanceof PlayerTimeoutError
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

            await Promise.all([
                playerA.destroy(),
                playerB.destroy(),
            ]);

            gameLogger.destroy();
        },
    );
