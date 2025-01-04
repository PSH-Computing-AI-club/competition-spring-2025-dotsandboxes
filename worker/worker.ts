/// <reference no-default-lib="true" />
/// <reference lib="deno.worker" />

import { expose } from '@workers/caplink';

import { makeDummyPlayer } from '../engine/dummy_player.ts';
import { makeGameBoard } from '../engine/game_board.ts';
import { makeGameSession } from '../engine/game_session.ts';
import type { IPlayer } from '../engine/player.ts';
import type { IPlayerMove } from '../engine/player_move.ts';

import { makeEngineNamespace } from './engine_namespace.ts';
import { makeMathNamespace } from './math_namespace.ts';
import { makeGameNamespace } from './game_namespace.ts';
import type { IWorkerGlobalThis } from './worker_global_this.ts';
import { makeWorkerGlobalThis } from './worker_global_this.ts';

let globalThis: IWorkerGlobalThis | null = null;

export interface IWorkerInitializeOptions {
    readonly columns: number;

    readonly payload: string;

    readonly playerInitial: string;

    readonly playerInitials: string[];

    readonly seed: number;

    readonly rows: number;
}

export interface IWorkerAPI {
    computePlayerMove(): IPlayerMove;

    destroy(): void;

    initialize(options: IWorkerInitializeOptions): void;
}

export const WORKER_API = {
    computePlayerMove() {
    },

    destroy() {
        globalThis = null;
    },

    initialize(options) {
        const { columns, playerInitial, playerInitials, rows, seed } = options;

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
    },
} satisfies IWorkerAPI;

expose(WORKER_API);
