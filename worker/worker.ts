/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { expose } from '@workers/caplink';

import type { IPlayer, IPlayerMove } from '../engine/mod.ts';
import {
    makeDummyPlayer,
    makeGameBoard,
    makeGameSession,
    makePlayerTurnFromPlayerMove,
} from '../engine/mod.ts';

import { makeEngineNamespace } from './engine_namespace.ts';
import { makeMathNamespace } from './math_namespace.ts';
import { makeGameNamespace } from './game_namespace.ts';
import type { IComputePlayerMoveCallback } from './player_script.ts';
import { evaluatePlayerScript } from './player_script.ts';
import type { IWorkerGlobalThis } from './worker_global_this.ts';
import { makeWorkerGlobalThis } from './worker_global_this.ts';

let computePlayerMoveCallback: IComputePlayerMoveCallback | null = null;

let globalThis: IWorkerGlobalThis | null = null;

let playerLookup: Record<string, IPlayer | undefined> | null = null;

export interface IInitializeOptions {
    readonly code: string;

    readonly columns: number;

    readonly playerInitial: string;

    readonly playerInitials: string[];

    readonly seed: number;

    readonly rows: number;
}

export interface IOnTurnMoveOptions {
    readonly playerInitial: string;

    readonly playerMove: IPlayerMove;

    readonly turnIndex: number;
}

export interface IOnTurnStartOptions {
    readonly playerInitial: string;

    readonly turnIndex: number;
}

export interface IWorkerAPI {
    computePlayerMove(): Promise<IPlayerMove | null> | IPlayerMove | null;

    destroy(): void;

    initialize(options: IInitializeOptions): Promise<void>;

    onTurnMove(options: IOnTurnMoveOptions): void;

    onTurnStart(options: IOnTurnStartOptions): void;
}

export const WORKER_API = {
    onTurnMove(options) {
        const { playerInitial, playerMove, turnIndex } = options;
        const { session: gameSession } = globalThis!.Game;

        const player = playerLookup![playerInitial]!;

        const playerTurn = makePlayerTurnFromPlayerMove(playerMove, {
            player,
            turnIndex,
        });

        gameSession.applyPlayerTurn(playerTurn);
    },

    onTurnStart(options) {
        const { playerInitial, turnIndex } = options;
        const { session: gameSession } = globalThis!.Game;

        const player = playerLookup![playerInitial]!;

        gameSession.EVENT_TURN_START.dispatch({
            player,
            turnIndex,
        });
    },

    computePlayerMove() {
        return computePlayerMoveCallback ? computePlayerMoveCallback() : null;
    },

    destroy() {
        computePlayerMoveCallback = null;
        globalThis = null;
        playerLookup = null;
    },

    async initialize(options) {
        const { code, columns, playerInitial, playerInitials, rows, seed } =
            options;

        const players: IPlayer[] = playerInitials.map((playerInitial) =>
            makeDummyPlayer({ playerInitial, seed })
        );

        playerLookup = Object.fromEntries(players.map((player) => {
            const { playerInitial } = player;

            return [playerInitial, player];
        }));

        const player = playerLookup[playerInitial]!;

        const gameBoard = makeGameBoard({ columns, rows });
        const gameSession = makeGameSession({ gameBoard, players, timeout: 0 });

        const Engine = makeEngineNamespace();
        const Game = makeGameNamespace({ gameBoard, gameSession, player });
        const Math = makeMathNamespace({ seed });

        globalThis = makeWorkerGlobalThis({
            Engine,
            Game,
            Math,
        });

        computePlayerMoveCallback = await evaluatePlayerScript({
            code,
            globalThis,
            timeout: 1000,
        });
    },
} satisfies IWorkerAPI;

expose(WORKER_API);
