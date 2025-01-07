import type { LevelName as STDLevelName } from '@std/log';

import type {
    IGameBoard,
    IGameResult,
    IGameSession,
    IPlayer,
} from '../engine/mod.ts';
import { WIN_KIND } from '../engine/mod.ts';

import type { ValueOf } from '../util/mod.ts';
import { truncate } from '../util/mod.ts';

import { getOutputLogger, OUTPUT_KIND } from './output_logger.ts';

type LevelName = Lowercase<Exclude<STDLevelName, 'NOTSET'>>;

export const MESSAGE_KIND = {
    appliedCapture: 'MESSAGE_APPLIED_CAPTURE',

    placedLine: 'MESSAGE_PLACED_LINE',

    playerError: 'MESSAGE_PLAYER_ERROR',

    playerForfeit: 'MESSAGE_PLAYER_FORFEIT',

    playerTimeout: 'MESSAGE_PLAYER_TIMEOUT',

    sessionEnd: 'MESSAGE_SESSION_END',

    sessionStart: 'MESSAGE_SESSION_START',

    turnEnd: 'MESSAGE_TURN_END',

    turnMove: 'MESSAGE_TURN_MOVE',

    turnStart: 'MESSAGE_TURN_START',
} as const;

export type MessageKind = ValueOf<typeof MESSAGE_KIND>;

export interface IAppliedCaptureArgs {
    readonly playerInitial: string;

    readonly x: number;

    readonly y: number;
}

export interface IPlacedLineArgs {
    readonly playerInitial: string;

    readonly x: number;

    readonly y: number;
}

export interface IPlayerErrorArgs {
    readonly playerInitial: string;

    readonly errorName: string;

    readonly errorMessage: string;

    readonly errorStack?: string;
}

export interface IPlayerForfeitArgs {
    readonly playerInitial: string;
}

export interface IPlayerTimeoutArgs {
    readonly playerInitial: string;
}

export interface ISessionEndArgs {
    readonly scores: Record<string, number>;
}

export interface ISessionStartArgs {
    readonly columns: number;

    readonly players: {
        readonly playerIdentifier: string;

        readonly playerInitial: string;
    }[];

    readonly rows: number;
}

export interface ITurnEndArgs {
    readonly capturesMade: number;

    readonly playerInitial: string;

    readonly turnIndex: number;
}

export interface ITurnMoveArgs {
    readonly playerInitial: string;

    readonly x: number;

    readonly y: number;

    readonly turnIndex: number;
}

export interface ITurnStartArgs {
    readonly playerInitial: string;

    readonly turnIndex: number;
}

export type IGameLogArgs =
    | IAppliedCaptureArgs
    | IPlacedLineArgs
    | IPlayerForfeitArgs
    | IPlayerTimeoutArgs
    | ISessionEndArgs
    | ISessionStartArgs
    | ITurnEndArgs
    | IPlayerErrorArgs
    | ITurnMoveArgs
    | ITurnStartArgs;

export interface IGameLoggerOptions {
    readonly gameBoard: IGameBoard;

    readonly gameSession: IGameSession;

    readonly seed: number;
}

export interface IGameLogger {
    destroy(): void;

    endSession(gameResult: IGameResult): void;

    initializePlayerError(player: IPlayer, error: Error): void;

    startSession(): void;
}

export function makeGameLogger(options: IGameLoggerOptions): IGameLogger {
    const { gameBoard, gameSession, seed } = options;
    const outputLogger = getOutputLogger();

    const playerComputeDurations = new Map<IPlayer, number[]>(
        gameSession.players.map((player) => {
            return [player, []];
        }),
    );

    let currentTurnMoveTimestamp: number | null = null;
    let currentTurnStartTimestamp: number | null = null;

    const playersThatErrored: Set<IPlayer> = new Set();
    let playerThatForfeited: IPlayer | null = null;
    let playerThatTimedout: IPlayer | null = null;

    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['appliedCapture'],
        args: IAppliedCaptureArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['placedLine'],
        args: IPlacedLineArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['playerError'],
        args: IPlayerErrorArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['playerForfeit'],
        args: IPlayerForfeitArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['playerTimeout'],
        args: IPlayerTimeoutArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['sessionStart'],
        args: ISessionStartArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['sessionEnd'],
        args: ISessionEndArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['turnEnd'],
        args: ITurnEndArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['turnMove'],
        args: ITurnMoveArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: typeof MESSAGE_KIND['turnStart'],
        args: ITurnStartArgs,
    ): void;
    function logGameRecord(
        levelName: LevelName,
        messageKind: MessageKind,
        args: IGameLogArgs,
    ): void {
        outputLogger[levelName](messageKind, args);
    }

    const appliedCaptureSubscription = gameBoard.EVENT_APPLIED_CAPTURE
        .subscribe((event) => {
            const { newBoardSlot } = event;

            const { playerTurn, x, y } = newBoardSlot;
            const { playerInitial } = playerTurn.player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human:
                    outputLogger.info(
                        `Player ${playerInitial} captured the box at (${x}, ${y}).`,
                    );

                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.appliedCapture, {
                        playerInitial,
                        x,
                        y,
                    });

                    break;
            }
        });

    const placedLineSubscription = gameBoard.EVENT_PLACED_LINE
        .subscribe((event) => {
            const { newBoardSlot } = event;

            const { playerTurn, x, y } = newBoardSlot;
            const { player, turnIndex } = playerTurn;
            const { playerInitial } = player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    const durations = playerComputeDurations.get(player);
                    const duration = currentTurnMoveTimestamp! -
                        currentTurnStartTimestamp!;

                    outputLogger.info(
                        `[TURN ${
                            turnIndex + 1
                        }] Player ${playerInitial} placed a line at (${x}, ${y}) and took ${
                            truncate(duration, 3)
                        }ms to compute.`,
                    );

                    durations!.push(duration);
                    break;
                }

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.placedLine, {
                        playerInitial,
                        x,
                        y,
                    });

                    break;
            }
        });

    const playerForfeitSubscription = gameSession.EVENT_PLAYER_FORFEIT
        .subscribe((event) => {
            const { player } = event;

            const { playerInitial } = player;

            playerThatForfeited = player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    outputLogger.error(
                        `Player ${playerInitial} forfeited the game session.`,
                    );

                    break;
                }

                case OUTPUT_KIND.jsonl:
                    logGameRecord('error', MESSAGE_KIND.playerForfeit, {
                        playerInitial,
                    });

                    break;
            }
        });

    const playerTimeoutSubscription = gameSession.EVENT_PLAYER_TIMEOUT
        .subscribe((event) => {
            const { player } = event;

            const { playerInitial } = player;

            playerThatTimedout = player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    outputLogger.error(
                        `Player ${playerInitial} took too long to compute their move.`,
                    );

                    break;
                }

                case OUTPUT_KIND.jsonl:
                    logGameRecord('error', MESSAGE_KIND.playerTimeout, {
                        playerInitial,
                    });

                    break;
            }
        });

    const turnEndSubscription = gameSession.EVENT_TURN_END
        .subscribe((event) => {
            const { capturesMade, player, turnIndex } = event;

            const { playerInitial } = player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    const visualizedGameBoard = gameBoard.toString();

                    outputLogger.info('\n' + visualizedGameBoard + '\n');
                    break;
                }

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.turnEnd, {
                        capturesMade,
                        playerInitial,
                        turnIndex,
                    });

                    break;
            }
        });

    const turnErrorSubscription = gameSession.EVENT_TURN_ERROR
        .subscribe((event) => {
            const { error, player } = event;

            const { playerInitial } = player;

            playersThatErrored.add(player);

            const { message, name, stack } = error;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human:
                    outputLogger.warn(
                        `Player ${playerInitial} had an error while computing or performing a move:`,
                    );

                    if (stack) outputLogger.error(`\n${stack}\n`);
                    else outputLogger.error(`\n${name}: ${message}\n`);

                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.playerError, {
                        errorName: name,
                        errorMessage: message,
                        errorStack: stack,
                        playerInitial,
                    });

                    break;
            }
        });

    const turnMoveSubscription = gameSession.EVENT_TURN_MOVE
        .subscribe((event) => {
            const { playerMove, player, turnIndex } = event;

            const { playerInitial } = player;
            const { x, y } = playerMove;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    currentTurnMoveTimestamp = performance.now();

                    break;
                }

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.turnMove, {
                        playerInitial,
                        turnIndex,
                        x,
                        y,
                    });

                    break;
            }
        });

    const turnStartSubscription = gameSession.EVENT_TURN_START
        .subscribe((event) => {
            const { player, turnIndex } = event;

            const { playerInitial } = player;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human:
                    currentTurnStartTimestamp = performance.now();

                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.turnStart, {
                        playerInitial,
                        turnIndex,
                    });

                    break;
            }
        });

    return {
        destroy() {
            appliedCaptureSubscription.destroy();
            placedLineSubscription.destroy();

            playerForfeitSubscription.destroy();
            playerTimeoutSubscription.destroy();

            turnEndSubscription.destroy();
            turnErrorSubscription.destroy();
            turnMoveSubscription.destroy();
            turnStartSubscription.destroy();
        },

        endSession(gameResult) {
            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    const { players } = gameSession;
                    const { scores, winKind, winningPlayers } = gameResult;

                    for (const player of players) {
                        const { playerInitial } = player;
                        const playerIdentifier = player.toString();

                        const durations = playerComputeDurations.get(player)!;
                        const score = scores.get(player)!;

                        const averageComputeDuration = durations.length > 0
                            ? truncate(
                                durations.reduce((sum, duration) => {
                                    return sum + duration;
                                }, 0) / durations.length,
                                3,
                            )
                            : 0;

                        if (winningPlayers.has(player)) {
                            outputLogger.info(
                                `Player ${playerInitial} [${playerIdentifier}] has ${score} ${
                                    score > 1 ? 'boxes' : 'box'
                                } w/ an average compute time of ${averageComputeDuration}ms (${
                                    winKind === WIN_KIND.multiple
                                        ? 'tie'
                                        : 'win'
                                }).`,
                            );
                        } else if (playersThatErrored.has(player)) {
                            outputLogger.info(
                                `Player ${playerInitial} [${playerIdentifier}] has -1 boxes w/ an average compute time of ${averageComputeDuration}ms (error).`,
                            );
                        } else if (playerThatForfeited === player) {
                            outputLogger.info(
                                `Player ${playerInitial} [${playerIdentifier}] has -1 boxes w/ an average compute time of ${averageComputeDuration}ms (forfeited).`,
                            );
                        } else if (playerThatTimedout === player) {
                            outputLogger.info(
                                `Player ${playerInitial} [${playerIdentifier}] has -1 boxes w/ an average compute time of ${averageComputeDuration}ms (timed out).`,
                            );
                        } else {
                            outputLogger.info(
                                `Player ${playerInitial} [${playerIdentifier}] has ${score} ${
                                    score > 1 ? 'boxes' : 'box'
                                } w/ an average compute time of ${averageComputeDuration}ms (${
                                    winKind === WIN_KIND.no_contest
                                        ? 'no contest'
                                        : 'lost'
                                }).`,
                            );
                        }
                    }

                    break;
                }

                case OUTPUT_KIND.jsonl: {
                    const scores: Record<string, number> = Object.fromEntries(
                        gameResult.scores.entries().map((
                            [player, score],
                        ) => {
                            const { playerInitial } = player;

                            return [playerInitial, score];
                        }),
                    );

                    logGameRecord('info', MESSAGE_KIND.sessionEnd, {
                        scores,
                    });

                    break;
                }
            }
        },

        initializePlayerError(player, error) {
            const { message, name, stack } = error;
            const { playerInitial } = player;

            playersThatErrored.add(player);

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human:
                    outputLogger.warn(
                        `Player ${playerInitial} had an error while initializing:`,
                    );

                    if (stack) outputLogger.error(`\n${stack}\n`);
                    else outputLogger.error(`\n${name}: ${message}\n`);

                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.playerError, {
                        errorName: name,
                        errorMessage: message,
                        errorStack: stack,
                        playerInitial,
                    });

                    break;
            }
        },

        startSession() {
            const { columns, rows } = gameBoard;

            switch (outputLogger.loggerName) {
                case OUTPUT_KIND.human: {
                    const { players } = gameSession;
                    const visualizedGameBoard = gameBoard.toString();

                    outputLogger.info(
                        'Simulating Dots and Boxes game session.\n',
                    );

                    outputLogger.info(`Seed: ${seed}\n`);
                    outputLogger.info('Players:\n');

                    for (const player of players) {
                        const { playerInitial } = player;
                        const playerIdentifier = player.toString();

                        outputLogger.info(
                            `Player ${playerInitial} [${playerIdentifier}]`,
                        );
                    }

                    outputLogger.info('');

                    outputLogger.info(`${columns}x${rows} Game Board:`);
                    outputLogger.info('\n' + visualizedGameBoard + '\n');

                    break;
                }

                case OUTPUT_KIND.jsonl: {
                    const players = gameSession.players.map((player) => {
                        const { playerInitial } = player;
                        const playerIdentifier = player.toString();

                        return {
                            playerIdentifier,
                            playerInitial,
                        };
                    });

                    logGameRecord('info', MESSAGE_KIND.sessionStart, {
                        columns,
                        rows,
                        players,
                    });

                    break;
                }
            }
        },
    };
}
