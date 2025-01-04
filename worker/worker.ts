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
import { evaluatePlayerScript } from './player_script.ts';
import type { IWorkerGlobalThis } from './worker_global_this.ts';
import { makeWorkerGlobalThis } from './worker_global_this.ts';

let globalThis: IWorkerGlobalThis | null = null;

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

export interface IWorkerAPI {
    computePlayerMove(): IPlayerMove | null;

    destroy(): void;

    initialize(options: IInitializeOptions): Promise<void>;

    onTurnMove(options: IOnTurnMoveOptions): void;
}

export const WORKER_API = {
    onTurnMove(options) {
        // **TODO:** Handle turn rotation.

        const { playerInitial, playerMove, turnIndex } = options;
        const { board: gameBoard, session: gameSession } = globalThis!.Game;

        const player = gameSession.players.find((player) =>
            player.playerInitial === playerInitial
        )!;

        const playerTurn = makePlayerTurnFromPlayerMove(playerMove, {
            player,
            turnIndex,
        });

        gameBoard.placeLine(playerTurn);
        gameBoard.applyCaptures();
    },

    computePlayerMove() {
        const { onComputePlayerTurn } = globalThis!;

        return onComputePlayerTurn ? onComputePlayerTurn() : null;
    },

    destroy() {
        globalThis = null;
    },

    async initialize(options) {
        const { code, columns, playerInitial, playerInitials, rows, seed } =
            options;

        const players: IPlayer[] = playerInitials.map((playerInitial) =>
            makeDummyPlayer({ playerInitial, seed })
        );

        const player = players.find((player) =>
            player.playerInitial === playerInitial
        )!;

        const gameBoard = makeGameBoard({ columns, rows });
        const gameSession = makeGameSession({ players, timeout: 0 });

        const Engine = makeEngineNamespace();
        const Game = makeGameNamespace({ gameBoard, gameSession, player });
        const Math = makeMathNamespace({ seed });

        globalThis = makeWorkerGlobalThis({
            Engine,
            Game,
            Math,
        });

        await evaluatePlayerScript({
            code,
            globalThis,
            timeout: 1000,
        });

        console.log({
            onComputePlayerTurn: globalThis.onComputePlayerTurn,
        });
    },
} satisfies IWorkerAPI;

expose(WORKER_API);
