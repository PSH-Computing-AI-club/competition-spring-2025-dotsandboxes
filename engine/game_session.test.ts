import {
    assertArrayIncludes,
    assertEquals,
    assertInstanceOf,
    assertObjectMatch,
    assertRejects,
} from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import type { IPlayer } from './player.ts';
import { makeGameBoard } from './game_board.ts';
import { SLOT_KIND } from './game_board_slot.ts';
import { makeGameSession } from './game_session.ts';

// **TEST:** Test events

Deno.test(function makeGameSession_Success() {
    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const gameSession = makeGameSession({
        players: [playerA, playerB],
        timeout: 0,
    });

    assertTypeOf(gameSession, 'object');

    assertInstanceOf(gameSession.playerTurns, Array);
    assertInstanceOf(gameSession.players, Array);

    assertTypeOf(gameSession.players[0], 'object');
    assertTypeOf(gameSession.players[1], 'object');

    assertInstanceOf(gameSession.players[0].computePlayerMove, Function);
    assertTypeOf(gameSession.players[0].playerInitial, 'string');
    assertTypeOf(gameSession.players[0].seed, 'number');

    assertInstanceOf(gameSession.players[1].computePlayerMove, Function);
    assertTypeOf(gameSession.players[1].playerInitial, 'string');
    assertTypeOf(gameSession.players[1].seed, 'number');

    assertInstanceOf(gameSession.applyNextPlayerTurn, Function);

    assertObjectMatch(gameSession, {
        playerTurns: [],

        players: [
            playerA,
            playerB,
        ],
    });
});

Deno.test(async function IGameSession_applyNextPlayerTurn_Success() {
    const playerA = {
        playerInitial: 'A',
        seed: 0,

        async computePlayerMove(_gameSession, _gameBoard) {
            return {
                x: 1,
                y: 0,
            };
        },
    } satisfies IPlayer;

    const playerB = {
        playerInitial: 'B',
        seed: 0,

        async computePlayerMove(_gameSession, _gameBoard) {
            return {
                x: 0,
                y: 1,
            };
        },
    } satisfies IPlayer;

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        players: [playerA, playerB],
        timeout: 0,
    });

    const playerTurn0 = (await gameSession.applyNextPlayerTurn(gameBoard))!;

    assertTypeOf(playerTurn0, 'object');

    assertTypeOf(playerTurn0!.player, 'object');
    assertTypeOf(playerTurn0!.turnIndex, 'number');
    assertTypeOf(playerTurn0!.x, 'number');
    assertTypeOf(playerTurn0!.y, 'number');

    assertEquals(playerTurn0, {
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = (await gameSession.applyNextPlayerTurn(gameBoard))!;

    assertTypeOf(playerTurn1, 'object');

    assertTypeOf(playerTurn1!.player, 'object');
    assertTypeOf(playerTurn1!.turnIndex, 'number');
    assertTypeOf(playerTurn1!.x, 'number');
    assertTypeOf(playerTurn1!.y, 'number');

    assertEquals(playerTurn1, {
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    assertArrayIncludes(
        // **HACK:** We only need to check these properties and there isn't an array
        // equivalent of `assertObjectMatch` on collection items.
        gameBoard.grid.map((row) =>
            row.map(({ playerTurn, slotKind, x, y }) => ({
                playerTurn,
                slotKind,
                x,
                y,
            }))
        ),
        [
            // y = 0

            [
                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 0,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.line,
                    playerTurn: playerTurn0,
                    x: 1,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 2,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 3,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 4,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 5,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 6,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 7,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 8,
                    y: 0,
                },
            ],

            // y = 1

            [
                {
                    slotKind: SLOT_KIND.line,
                    playerTurn: playerTurn1,
                    x: 0,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 1,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 2,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 3,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 4,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 5,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 6,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 7,
                    y: 1,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 8,
                    y: 1,
                },
            ],
        ],
    );
});

Deno.test(
    async function IGameSession_applyNextPlayerTurn_NoNextPlayerError_Failure() {
        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            players: [],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.applyNextPlayerTurn(gameBoard);
            },
            "bad dispatch to 'IGameSession.applyNextPlayerTurn' (no players available in 'IGameSession.players')",
        );
    },
);

Deno.test(
    async function IGameSession_applyNextPlayerTurn_PlayerComputeThrowError_Failure() {
        const playerA = {
            playerInitial: 'A',
            seed: 0,

            computePlayerMove(_gameSession, _gameBoard) {
                throw new Error('hello world');
            },
        } satisfies IPlayer;

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            players: [playerA],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.applyNextPlayerTurn(gameBoard);
            },
            "bad dispatch to 'IGameSession.applyNextPlayerTurn' (player 'A' throw an error during computation during turn '1')",
        );
    },
);

Deno.test(
    async function IGameSession_applyNextPlayerTurn_PlayerForfeit_Failure() {
        const playerA = {
            playerInitial: 'A',
            seed: 0,

            async computePlayerMove(_gameSession, _gameBoard) {
                return null;
            },
        } satisfies IPlayer;

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            players: [playerA],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.applyNextPlayerTurn(gameBoard);
            },
            "bad dispatch to 'IGameSession.applyNextPlayerTurn' (player 'A' forfeited the game)",
        );
    },
);

Deno.test(
    async function IGameSession_applyNextPlayerTurn_PlayerInvalidPlacement_Failure() {
        const playerA = {
            playerInitial: 'A',
            seed: 0,

            async computePlayerMove(_gameSession, _gameBoard) {
                return {
                    x: 0,
                    y: 0,
                };
            },
        } satisfies IPlayer;

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            players: [playerA],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.applyNextPlayerTurn(gameBoard);
            },
            "bad dispatch to 'IGameSession.applyNextPlayerTurn' (player 'A' tried to place a line at invalid gameboard slot '(0, 0)')",
        );
    },
);

Deno.test(
    async function IGameSession_applyNextPlayerTurn_PlayerTimeout_Failure() {
        let timeoutIdentifier: number | null = null;

        const playerA = {
            playerInitial: 'A',
            seed: 0,

            computePlayerMove(_gameSession, _gameBoard) {
                return new Promise((resolve, _reject) => {
                    timeoutIdentifier = setTimeout(resolve, 99999999);
                });
            },
        } satisfies IPlayer;

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            players: [playerA],
            timeout: 10,
        });

        await assertRejects(
            async () => {
                await gameSession.applyNextPlayerTurn(gameBoard);
            },
            "bad dispatch to 'IGameSession.applyNextPlayerTurn' (player 'A' timed out during compute)",
        );

        if (timeoutIdentifier) clearTimeout(timeoutIdentifier);
    },
);
