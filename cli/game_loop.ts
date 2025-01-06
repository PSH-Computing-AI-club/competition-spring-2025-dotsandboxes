import { resolve } from '@std/path';

import type { IPlayerTurn } from '../engine/mod.ts';
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

import { makeGameLogger } from './game_logger.ts';

const UTF16_CODE_LETTER_A = 65;

interface IRunGameLoopOptions {
    readonly gridColumns: number;

    readonly gridRows: number;

    readonly files: string[];

    readonly seed: number;

    readonly timeout: number;
}

export async function runGameLoop(options: IRunGameLoopOptions): Promise<void> {
    const {
        files,
        gridColumns,
        gridRows,
        seed,
        timeout,
    } = options;

    const players = files.map((filePath, index) => {
        const playerInitial = String.fromCharCode(
            UTF16_CODE_LETTER_A + index,
        );

        filePath = resolve(filePath);

        return makeWebWorkerPlayer({
            filePath,
            playerInitial,
            seed,
        });
    });

    const gameBoard = makeGameBoard({
        columns: gridColumns,
        rows: gridRows,
    });

    const gameSession = makeGameSession({
        gameBoard,
        players,
        timeout,
    });

    const gameLogger = makeGameLogger({
        gameBoard,
        gameSession,
        seed,
    });

    let hadPlayerError: boolean = false;

    gameLogger.startSession();

    await Promise.all(
        players.map(async (player) => {
            try {
                await player.initialize({
                    gameBoard,
                    gameSession,
                });
            } catch (error) {
                hadPlayerError = true;

                gameLogger.initializePlayerError(
                    player,
                    // **HACK:** This could maybe not be an `Error` instance... but
                    // surely who would throw anything but!?
                    error as Error,
                );
            }
        }),
    );

    if (!hadPlayerError) {
        while (gameBoard.remainingBoxes > 0) {
            let playerTurn: IPlayerTurn | null = null;

            try {
                playerTurn = await gameSession.computeNextPlayerTurn();
            } catch (error) {
                if (
                    error instanceof PlayerComputeThrowError ||
                    error instanceof PlayerForfeitError ||
                    error instanceof PlayerTimeoutError
                ) {
                    break;
                }

                throw error;
            }

            let capturesMade: number | null = null;

            try {
                capturesMade = gameSession.applyPlayerTurn(playerTurn);
            } catch (error) {
                if (error instanceof InvalidPlacementError) {
                    break;
                }

                throw error;
            }

            gameSession.shiftTurnOrder(capturesMade);
        }
    }

    const gameResult = computeGameResultFromGame(
        gameSession,
        gameBoard,
    );

    gameLogger.endSession(gameResult);

    await Promise.all(
        players.map((player) => player.destroy()),
    );

    gameLogger.destroy();
}
