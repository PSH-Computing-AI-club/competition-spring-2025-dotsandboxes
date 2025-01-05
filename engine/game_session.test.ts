import {
    assertArrayIncludes,
    assertEquals,
    assertInstanceOf,
    assertObjectMatch,
    assertRejects,
    assertThrows,
} from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeConstantPlayer } from './constant_player.ts';
import { makeDummyPlayer } from './dummy_player.ts';
import type { IPlayer } from './player.ts';
import { makeGameBoard } from './game_board.ts';
import { SLOT_KIND } from './game_board_slot.ts';
import { makeGameSession } from './game_session.ts';
import { makeForfeitPlayer } from './forfeit_player.ts';

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

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        gameBoard,
        players: [playerB, playerA],
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

    assertInstanceOf(gameSession.applyPlayerTurn, Function);
    assertInstanceOf(gameSession.computeNextPlayerTurn, Function);

    assertObjectMatch(gameSession, {
        gameBoard,
        playerTurns: [],

        players: [
            playerA,
            playerB,
        ],
    });
});

Deno.test(async function IGameSession_computeNextPlayerTurn_Success() {
    const playerA = makeConstantPlayer({
        playerInitial: 'A',
        seed: 0,
        x: 1,
        y: 0,
    });

    const playerB = makeConstantPlayer({
        playerInitial: 'B',
        seed: 0,
        x: 0,
        y: 1,
    });

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        gameBoard,
        players: [playerA, playerB],
        timeout: 0,
    });

    const playerTurn = await gameSession.computeNextPlayerTurn();

    assertTypeOf(playerTurn, 'object');

    assertTypeOf(playerTurn.player, 'object');
    assertTypeOf(playerTurn.turnIndex, 'number');
    assertTypeOf(playerTurn.x, 'number');
    assertTypeOf(playerTurn.y, 'number');

    assertEquals(playerTurn, {
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });
});

Deno.test(
    async function IGameSession_computeNextPlayerTurn_NoNextPlayerError_Failure() {
        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            gameBoard,
            players: [],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.computeNextPlayerTurn();
            },
        );
    },
);

Deno.test(
    async function IGameSession_computeNextPlayerTurn_PlayerComputeThrowError_Failure() {
        const dummyPlayer = makeDummyPlayer({
            playerInitial: 'D',
            seed: 0,
        });

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            gameBoard,
            players: [dummyPlayer],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.computeNextPlayerTurn();
            },
        );
    },
);

Deno.test(
    async function IGameSession_computeNextPlayerTurn_PlayerForfeit_Failure() {
        const forfeitPlayer = makeForfeitPlayer({
            playerInitial: 'F',
            seed: 0,
        });

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            gameBoard,
            players: [forfeitPlayer],
            timeout: 0,
        });

        await assertRejects(
            async () => {
                await gameSession.computeNextPlayerTurn();
            },
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
            gameBoard,
            players: [playerA],
            timeout: 10,
        });

        await assertRejects(
            async () => {
                await gameSession.computeNextPlayerTurn();
            },
        );

        if (timeoutIdentifier) clearTimeout(timeoutIdentifier);
    },
);

Deno.test(async function IGameSession_applyPlayerTurn_Success() {
    const playerA = makeConstantPlayer({
        playerInitial: 'A',
        seed: 0,
        x: 1,
        y: 0,
    });

    const playerB = makeConstantPlayer({
        playerInitial: 'B',
        seed: 0,
        x: 0,
        y: 1,
    });

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        gameBoard,
        players: [playerA, playerB],
        timeout: 0,
    });

    const playerTurn0 = await gameSession.computeNextPlayerTurn();

    gameSession.applyPlayerTurn(playerTurn0);

    const playerTurn1 = await gameSession.computeNextPlayerTurn();

    gameSession.applyPlayerTurn(playerTurn1);

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
    async function IGameSession_applyPlayerTurn_PlayerInvalidPlacement_Failure() {
        const constantPlayer = makeConstantPlayer({
            playerInitial: 'A',
            seed: 0,
            x: 0,
            y: 0,
        });

        const gameBoard = makeGameBoard({
            columns: 5,
            rows: 3,
        });

        const gameSession = makeGameSession({
            gameBoard,
            players: [constantPlayer],
            timeout: 0,
        });

        const playerTurn = await gameSession.computeNextPlayerTurn();

        assertThrows(
            () => {
                gameSession.applyPlayerTurn(playerTurn);
            },
        );
    },
);
