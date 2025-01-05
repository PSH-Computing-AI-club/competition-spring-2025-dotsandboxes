import type { IEvent } from '../util/mod.ts';
import { event, timeout, TimeoutError } from '../util/mod.ts';

import {
    InvalidPlacementError,
    NoNextPlayerError,
    PlayerComputeThrowError,
    PlayerForfeitError,
    PlayerTimeoutError,
} from './errors.ts';
import type { IGameBoard } from './game_board.ts';
import type { IPlayer } from './player.ts';
import type { IPlayerMove } from './player_move.ts';
import type { IPlayerTurn } from './player_turn.ts';
import { makePlayerTurnFromPlayerMove } from './player_turn.ts';

export interface IPlayerForfeitEvent {
    readonly player: IPlayer;

    readonly turnIndex: number;
}

export interface IPlayerTimeoutEvent {
    readonly player: IPlayer;

    readonly turnIndex: number;
}

export interface ITurnErrorEvent {
    readonly error: Error;

    readonly player: IPlayer;

    readonly turnIndex: number;
}

export interface ITurnEndEvent {
    readonly capturesMade: number;

    readonly player: IPlayer;

    readonly turnIndex: number;
}

export interface ITurnMoveEvent {
    readonly player: IPlayer;

    readonly playerMove: IPlayerMove;

    readonly turnIndex: number;
}

export interface ITurnStartEvent {
    readonly player: IPlayer;

    readonly turnIndex: number;
}

export interface IGameSessionOptions {
    readonly gameBoard: IGameBoard;

    readonly players: IPlayer[];

    readonly timeout: number;
}

export interface IGameSession extends IGameSessionOptions {
    readonly EVENT_PLAYER_FORFEIT: IEvent<IPlayerForfeitEvent>;

    readonly EVENT_PLAYER_TIMEOUT: IEvent<IPlayerTimeoutEvent>;

    readonly EVENT_TURN_END: IEvent<ITurnEndEvent>;

    readonly EVENT_TURN_ERROR: IEvent<ITurnErrorEvent>;

    readonly EVENT_TURN_MOVE: IEvent<ITurnMoveEvent>;

    readonly EVENT_TURN_START: IEvent<ITurnStartEvent>;

    readonly playerTurns: IPlayerTurn[];

    applyPlayerTurn(playerTurn: IPlayerTurn): void;

    computeNextPlayerTurn(): Promise<IPlayerTurn>;
}

export function makeGameSession(options: IGameSessionOptions): IGameSession {
    const {
        gameBoard,
        players: initialPlayers,
        timeout: timeoutDuration,
    } = options;

    const EVENT_PLAYER_FORFEIT = event<IPlayerForfeitEvent>();
    const EVENT_PLAYER_TIMEOUT = event<IPlayerTimeoutEvent>();
    const EVENT_TURN_END = event<ITurnEndEvent>();
    const EVENT_TURN_ERROR = event<ITurnErrorEvent>();
    const EVENT_TURN_MOVE = event<ITurnMoveEvent>();
    const EVENT_TURN_START = event<ITurnStartEvent>();

    const turnOrderedPlayers: IPlayer[] = [...initialPlayers];

    const players: IPlayer[] = initialPlayers.toSorted(
        (playerA, playerB) => {
            const playerInitialA = playerA.playerInitial.toLowerCase();
            const playerInitialB = playerB.playerInitial.toLowerCase();

            return playerInitialB > playerInitialA ? -1 : 0;
        },
    );

    const playerTurns: IPlayerTurn[] = [];

    return {
        EVENT_PLAYER_FORFEIT,
        EVENT_PLAYER_TIMEOUT,
        EVENT_TURN_END,
        EVENT_TURN_ERROR,
        EVENT_TURN_MOVE,
        EVENT_TURN_START,

        gameBoard,
        players,
        playerTurns,
        timeout: timeoutDuration,

        applyPlayerTurn(playerTurn) {
            const { player, turnIndex, x, y } = playerTurn;

            try {
                gameBoard.placeLine(playerTurn);
            } catch (error) {
                if (error instanceof InvalidPlacementError) {
                    EVENT_TURN_ERROR.dispatch({
                        error,
                        player: player,
                        turnIndex,
                    });
                }

                throw error;
            }

            EVENT_TURN_MOVE.dispatch({
                player,
                playerMove: { x, y },
                turnIndex,
            });

            const capturesMade = gameBoard.applyCaptures();

            if (capturesMade == 0) {
                const player = turnOrderedPlayers.shift();

                if (player) turnOrderedPlayers.push(player);
            }

            playerTurns.push(playerTurn);

            EVENT_TURN_END.dispatch({
                capturesMade,
                player: player,
                turnIndex,
            });
        },

        async computeNextPlayerTurn() {
            const nextPlayer = turnOrderedPlayers[0];

            if (nextPlayer === undefined) {
                throw new NoNextPlayerError(
                    "bad dispatch to 'IGameSession.computeNextPlayerMove' (no players available in 'IGameSession.players')",
                );
            }

            const turnIndex = playerTurns.length;

            EVENT_TURN_START.dispatch({
                player: nextPlayer,
                turnIndex,
            });

            let playerMove: IPlayerMove | null = null;
            try {
                const playerMovePromise = nextPlayer.computePlayerMove(
                    this,
                    gameBoard,
                );

                playerMove = await timeout(playerMovePromise, timeoutDuration);
            } catch (error) {
                if (error instanceof TimeoutError) {
                    EVENT_PLAYER_TIMEOUT.dispatch({
                        player: nextPlayer,
                        turnIndex,
                    });

                    throw new PlayerTimeoutError(
                        `bad dispatch to 'IGameSession.computeNextPlayerMove' (player '${nextPlayer.playerInitial}' timed out during compute')`,
                        { player: nextPlayer },
                    );
                }

                const computeError = new PlayerComputeThrowError(
                    `bad dispatch to 'IGameSession.computeNextPlayerMove' (player '${nextPlayer.playerInitial}' threw an error during compute')`,
                    {
                        // **HACK:** This could maybe not be an `Error` instance... but
                        // surely who would throw anything but!?
                        error: error as Error,
                        player: nextPlayer,
                    },
                );

                EVENT_TURN_ERROR.dispatch({
                    error: computeError,
                    player: nextPlayer,
                    turnIndex,
                });

                throw computeError;
            }

            if (playerMove === null) {
                EVENT_PLAYER_FORFEIT.dispatch({
                    player: nextPlayer,
                    turnIndex,
                });

                throw new PlayerForfeitError(
                    `bad dispatch to 'IGameSession.computeNextPlayerTurn' (player '${nextPlayer.playerInitial}' forfeited the game)`,
                    { player: nextPlayer },
                );
            }

            return makePlayerTurnFromPlayerMove(playerMove, {
                player: nextPlayer,
                turnIndex,
            });
        },
    };
}
