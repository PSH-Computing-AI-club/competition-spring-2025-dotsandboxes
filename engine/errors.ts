import type { IPlayer } from './player.ts';
import type { IPlayerTurn } from './player_turn.ts';

export interface InvalidPlacementErrorOptions extends ErrorOptions {
    readonly playerTurn: IPlayerTurn;
}

export interface InvalidQueryErrorOptions extends ErrorOptions {
    readonly x: number;

    readonly y: number;
}

export interface PlayerComputeThrowErrorOptions extends ErrorOptions {
    readonly error: Error;

    readonly player: IPlayer;
}

export interface PlayerForfeitErrorOptions extends ErrorOptions {
    readonly player: IPlayer;
}

export interface PlayerTimeoutErrorOptions extends ErrorOptions {
    readonly player: IPlayer;
}

export class InvalidPlacementError extends Error {
    readonly playerTurn: IPlayerTurn;

    constructor(message: string, options: InvalidPlacementErrorOptions) {
        super(message, options);

        this.name = InvalidPlacementError.name;

        this.playerTurn = options.playerTurn;
    }
}

export class InvalidQueryError extends Error {
    readonly x: number;

    readonly y: number;

    constructor(message: string, options: InvalidQueryErrorOptions) {
        super(message, options);

        this.name = InvalidQueryError.name;

        const { x, y } = options;

        this.x = x;
        this.y = y;
    }
}

export class NoNextPlayerError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);

        this.name = NoNextPlayerError.name;
    }
}

export class PlayerComputeThrowError extends Error {
    readonly error: Error;

    readonly player: IPlayer;

    constructor(
        message: string,
        options: PlayerComputeThrowErrorOptions,
    ) {
        super(message, options);

        const { error, player } = options;

        this.error = error;
        this.name = PlayerComputeThrowError.name;
        this.player = player;
    }
}

export class PlayerForfeitError extends Error {
    readonly player: IPlayer;

    constructor(
        message: string,
        options: PlayerForfeitErrorOptions,
    ) {
        super(message, options);

        this.name = PlayerForfeitError.name;
        this.player = options.player;
    }
}

export class PlayerTimeoutError extends Error {
    readonly player: IPlayer;

    constructor(
        message: string,
        options: PlayerTimeoutErrorOptions,
    ) {
        super(message, options);

        this.name = PlayerTimeoutError.name;
        this.player = options.player;
    }
}
