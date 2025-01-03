import type { LevelName as STDLevelName } from '@std/log';

import type {
    IGameBoard,
    IGameResult,
    IGameSession,
    IPlayer,
} from '../engine/mod.ts';
import { PlayerComputeThrowError, WIN_KIND } from '../engine/mod.ts';

import type { ValueOf } from '../util/mod.ts';

import type { OutputKind } from './output_logger.ts';
import { getOutputLogger, OUTPUT_KIND } from './output_logger.ts';

type LevelName = Lowercase<Exclude<STDLevelName, 'NOTSET'>>;

export const MESSAGE_KIND = {
    appliedCapture: 'MESSAGE_APPLIED_CAPTURE',

    placedLine: 'MESSAGE_PLACED_LINE',

    playerForfeit: 'MESSAGE_PLAYER_FORFEIT',

    playerTimeout: 'MESSAGE_PLAYER_TIMEOUT',

    sessionEnd: 'MESSAGE_SESSION_END',

    sessionStart: 'MESSAGE_SESSION_START',

    turnEnd: 'MESSAGE_TURN_END',

    turnError: 'MESSAGE_TURN_ERROR',

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
        readonly playerInitial: string;
    }[];

    readonly rows: number;
}

export interface ITurnEndArgs {
    readonly capturesMade: number;

    readonly playerInitial: string;

    readonly turnIndex: number;
}

export interface ITurnErrorArgs {
    readonly playerInitial: string;

    readonly errorName: string;

    readonly errorMessage: string;

    readonly errorStack?: string;

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
    | ITurnErrorArgs
    | ITurnMoveArgs
    | ITurnStartArgs;

export interface IGameLoggerOptions {
    readonly gameBoard: IGameBoard;

    readonly gameSession: IGameSession;

    readonly outputKind: OutputKind;
}

export interface IGameLogger extends IGameLoggerOptions {
    destroy(): void;

    endSession(gameResult: IGameResult): void;

    startSession(): void;
}

export function makeGameLogger(options: IGameLoggerOptions): IGameLogger {
    const { gameBoard, gameSession, outputKind } = options;
    const outputLogger = getOutputLogger();

    const playerComputeDurations = new Map<IPlayer, number[]>(
        gameSession.players.map((player) => {
            return [player, []];
        }),
    );

    let currentTurnComputeDuration: number = -1;
    let currentTurnStartTimestamp: number = -1;

    let playerThatErrored: IPlayer | null = null;
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
        messageKind: typeof MESSAGE_KIND['turnError'],
        args: ITurnErrorArgs,
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

            switch (outputKind) {
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

            switch (outputKind) {
                case OUTPUT_KIND.human: {
                    outputLogger.info(
                        `[TURN ${
                            turnIndex + 1
                        }] Player ${playerInitial} placed a line at (${x}, ${y}) and took ${currentTurnComputeDuration}ms to compute.`,
                    );

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

            switch (outputKind) {
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

            switch (outputKind) {
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

            switch (outputKind) {
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
            const { player, turnIndex } = event;
            let { error } = event;

            const { playerInitial } = player;

            if (error instanceof PlayerComputeThrowError) ({ error } = error);

            playerThatErrored = player;

            const { message, name, stack } = error;

            switch (outputKind) {
                case OUTPUT_KIND.human:
                    outputLogger.warn(
                        `Player ${playerInitial} had an error while computing or performing a move:`,
                    );

                    if (stack) outputLogger.error(stack);
                    else outputLogger.error(`${name}: ${message}`);

                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.turnError, {
                        errorName: name,
                        errorMessage: message,
                        errorStack: stack,
                        playerInitial,
                        turnIndex,
                    });

                    break;
            }
        });

    const turnMoveSubscription = gameSession.EVENT_TURN_MOVE
        .subscribe((event) => {
            const { playerMove, player, turnIndex } = event;

            const { playerInitial } = player;
            const { x, y } = playerMove;

            switch (outputKind) {
                case OUTPUT_KIND.human: {
                    const currentTimestamp = Date.now();

                    currentTurnComputeDuration = currentTimestamp -
                        currentTurnStartTimestamp;

                    const durations = playerComputeDurations.get(player);

                    durations!.push(currentTurnComputeDuration);
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

            switch (outputKind) {
                case OUTPUT_KIND.human:
                    currentTurnStartTimestamp = Date.now();

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
        gameBoard,
        gameSession,
        outputKind,

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
            switch (outputKind) {
                case OUTPUT_KIND.human: {
                    const { players } = gameSession;
                    const { scores, winKind, winningPlayers } = gameResult;

                    for (const player of players) {
                        const { playerInitial } = player;
                        const score = scores.get(player)!;

                        if (winningPlayers.has(player)) {
                            outputLogger.info(
                                `Player ${playerInitial} has ${score} ${
                                    score > 1 ? 'boxes' : 'box'
                                } (${
                                    winKind === WIN_KIND.multiple
                                        ? 'tie'
                                        : 'win'
                                }).`,
                            );
                        } else if (playerThatErrored === player) {
                            outputLogger.info(
                                `Player ${playerInitial} has -1 boxes (error).`,
                            );
                        } else if (playerThatForfeited) {
                            outputLogger.info(
                                `Player ${playerInitial} has -1 boxes (forfeited).`,
                            );
                        } else if (playerThatTimedout) {
                            outputLogger.info(
                                `Player ${playerInitial} has -1 boxes (timed out).`,
                            );
                        } else {
                            outputLogger.info(
                                `Player ${playerInitial} has ${score} ${
                                    score > 1 ? 'boxes' : 'box'
                                } (${
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

        startSession() {
            const { columns, rows } = gameBoard;

            const players = gameSession.players.map((player) => {
                const { playerInitial } = player;

                return {
                    playerInitial,
                };
            });

            switch (outputKind) {
                case OUTPUT_KIND.human:
                    break;

                case OUTPUT_KIND.jsonl:
                    logGameRecord('info', MESSAGE_KIND.sessionStart, {
                        columns,
                        rows,
                        players,
                    });

                    break;
            }
        },
    };
}
