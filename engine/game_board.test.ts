import {
    assertArrayIncludes,
    assertEquals,
    assertInstanceOf,
    assertObjectMatch,
    assertThrows,
} from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import { makeGameBoard } from './game_board.ts';
import { SLOT_KIND } from './game_board_slot.ts';
import { makePlayerTurn } from './player_turn.ts';

// **TODO**: Test events

Deno.test(function makeGameBoard_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    assertTypeOf(gameBoard, 'object');

    assertTypeOf(gameBoard.columns, 'number');
    assertTypeOf(gameBoard.rows, 'number');

    assertTypeOf(gameBoard.boxesClaimed, 'number');
    assertTypeOf(gameBoard.columnPadding, 'number');
    assertTypeOf(gameBoard.expandedColumns, 'number');
    assertTypeOf(gameBoard.expandedRows, 'number');
    assertInstanceOf(gameBoard.grid, Array);
    assertTypeOf(gameBoard.remainingBoxes, 'number');
    assertTypeOf(gameBoard.rowPadding, 'number');
    assertTypeOf(gameBoard.totalBoxes, 'number');

    assertInstanceOf(gameBoard.walkBoxes, Function);
    assertInstanceOf(gameBoard.walkDots, Function);
    assertInstanceOf(gameBoard.walkSpacers, Function);

    assertObjectMatch(gameBoard, {
        columns: 5,
        rows: 3,

        columnPadding: 5 - 1,
        expandedColumns: 5 + (5 - 1),
        expandedRows: 3 + (3 - 1),
        rowPadding: 3 - 1,

        boxesClaimed: 0,
        horizontalSpacers: 3 * (5 - 1),
        remainingBoxes: (5 - 1) * (3 - 1),
        remainingSpacers: (3 * (5 - 1)) + (5 * (3 - 1)),
        spacersClaimed: 0,
        totalBoxes: (5 - 1) * (3 - 1),
        totalSpacers: (3 * (5 - 1)) + (5 * (3 - 1)),
        verticalSpacers: 5 * (3 - 1),

        grid: [
            // y = 0

            [
                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 0,
                    y: 0,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
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
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
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

            // y = 2

            [
                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 0,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 1,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 2,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 3,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 4,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 5,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 6,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 7,
                    y: 2,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 8,
                    y: 2,
                },
            ],

            // y = 3

            [
                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 0,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 1,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 2,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 3,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 4,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 5,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 6,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.box,
                    playerTurn: null,
                    x: 7,
                    y: 3,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 8,
                    y: 3,
                },
            ],

            // y = 4

            [
                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 0,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 1,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 2,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 3,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 4,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 5,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 6,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
                    x: 7,
                    y: 4,
                },

                {
                    slotKind: SLOT_KIND.dot,
                    playerTurn: null,
                    x: 8,
                    y: 4,
                },
            ],
        ],
    });
});

Deno.test(function IGameBoard_walkBoxes_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const iterator = gameBoard.walkBoxes();

    assertInstanceOf(iterator, Iterator);

    const gameBoardBoxes = iterator.toArray();

    assertEquals(
        // **HACK:** We only need to check these properties and there isn't an array
        // equivalent of `assertObjectMatch` on collection items.
        gameBoardBoxes.map(({ playerTurn, slotKind, x, y }) => ({
            playerTurn,
            slotKind,
            x,
            y,
        })),
        [
            // y = 1

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 1,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 3,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 5,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 7,
                y: 1,
            },

            // y = 3

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 1,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 3,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 5,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.box,
                playerTurn: null,
                x: 7,
                y: 3,
            },
        ],
    );
});

Deno.test(function IGameBoard_walkDots_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const iterator = gameBoard.walkDots();

    assertInstanceOf(iterator, Iterator);

    const gameBoardBoxes = iterator.toArray();

    assertEquals(
        gameBoardBoxes.map(({ playerTurn, slotKind, x, y }) => ({
            playerTurn,
            slotKind,
            x,
            y,
        })),
        [
            // y = 0

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 0,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 2,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 4,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 6,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 8,
                y: 0,
            },

            // y = 2

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 0,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 2,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 4,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 6,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 8,
                y: 2,
            },

            // y = 4

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 0,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 2,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 4,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 6,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.dot,
                playerTurn: null,
                x: 8,
                y: 4,
            },
        ],
    );
});

Deno.test(function IGameBoard_walkSpacers_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const iterator = gameBoard.walkSpacers();

    assertInstanceOf(iterator, Iterator);

    const gameBoardBoxes = iterator.toArray();

    assertEquals(
        gameBoardBoxes.map(({ playerTurn, slotKind, x, y }) => ({
            playerTurn,
            slotKind,
            x,
            y,
        })),
        [
            // y = 0, (odd, even)

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 1,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 3,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 5,
                y: 0,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 7,
                y: 0,
            },

            // y = 2, (odd, even)

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 1,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 3,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 5,
                y: 2,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 7,
                y: 2,
            },

            // y = 4, (odd, even)

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 1,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 3,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 5,
                y: 4,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 7,
                y: 4,
            },

            // y = 1, (even, odd)

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 0,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 2,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 4,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 6,
                y: 1,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 8,
                y: 1,
            },

            // y = 3, (even, odd)

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 0,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 2,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 4,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 6,
                y: 3,
            },

            {
                slotKind: SLOT_KIND.spacer,
                playerTurn: null,
                x: 8,
                y: 3,
            },
        ],
    );
});

Deno.test(function IGameBoard_placeLine_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    assertObjectMatch(gameBoard, {
        spacersClaimed: 0,
        remainingSpacers: 22,
    });

    gameBoard.placeLine(playerTurn0);

    assertObjectMatch(gameBoard, {
        spacersClaimed: 1,
        remainingSpacers: 21,
    });

    assertArrayIncludes(
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
                    slotKind: SLOT_KIND.spacer,
                    playerTurn: null,
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

    gameBoard.placeLine(playerTurn1);

    assertObjectMatch(gameBoard, {
        spacersClaimed: 2,
        remainingSpacers: 20,
    });

    assertArrayIncludes(
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

    gameBoard.placeLine(playerTurn2);

    assertObjectMatch(gameBoard, {
        spacersClaimed: 3,
        remainingSpacers: 19,
    });

    assertArrayIncludes(
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
                    slotKind: SLOT_KIND.line,
                    playerTurn: playerTurn2,
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

Deno.test(function IGameBoard_placeLine_Failure() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    const playerTurn3 = makePlayerTurn({
        player: playerA,
        turnIndex: 3,

        x: 1,
        y: 2,
    });

    gameBoard.placeLine(playerTurn0);
    gameBoard.placeLine(playerTurn1);
    gameBoard.placeLine(playerTurn2);
    gameBoard.placeLine(playerTurn3);

    assertThrows(
        () => {
            const playerTurnThrowDot = makePlayerTurn({
                player: playerB,
                turnIndex: 4,

                x: 0,
                y: 0,
            });

            gameBoard.placeLine(playerTurnThrowDot);
        },
    );

    assertThrows(
        () => {
            const playerTurnThrowBox = makePlayerTurn({
                player: playerB,
                turnIndex: 4,

                x: 3,
                y: 3,
            });

            gameBoard.placeLine(playerTurnThrowBox);
        },
    );

    assertThrows(
        () => {
            const playerTurnThrowInitial = makePlayerTurn({
                player: playerB,
                turnIndex: 4,

                x: 1,
                y: 1,
            });

            gameBoard.placeLine(playerTurnThrowInitial);
        },
    );

    assertThrows(
        () => {
            const playerTurnThrowLine = makePlayerTurn({
                player: playerB,
                turnIndex: 4,

                x: 1,
                y: 0,
            });

            gameBoard.placeLine(playerTurnThrowLine);
        },
    );
});

Deno.test(function IGameBoard_countSurroundingLines_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    const playerTurn3 = makePlayerTurn({
        player: playerA,
        turnIndex: 3,

        x: 1,
        y: 2,
    });

    const lineCountTurnInitial = gameBoard.countSurroundingLines(1, 1);

    assertTypeOf(lineCountTurnInitial, 'number');
    assertEquals(lineCountTurnInitial, 0);

    gameBoard.placeLine(playerTurn0);

    const lineCountTurn0 = gameBoard.countSurroundingLines(1, 1);

    assertTypeOf(lineCountTurn0, 'number');
    assertEquals(lineCountTurn0, 1);

    gameBoard.placeLine(playerTurn1);

    const lineCountTurn1 = gameBoard.countSurroundingLines(1, 1);

    assertTypeOf(lineCountTurn1, 'number');
    assertEquals(lineCountTurn1, 2);

    gameBoard.placeLine(playerTurn2);

    const lineCountTurn2 = gameBoard.countSurroundingLines(1, 1);

    assertTypeOf(lineCountTurn2, 'number');
    assertEquals(lineCountTurn2, 3);

    gameBoard.placeLine(playerTurn3);

    const lineCountTurn3 = gameBoard.countSurroundingLines(1, 1);

    assertTypeOf(lineCountTurn3, 'number');
    assertEquals(lineCountTurn3, 4);
});

Deno.test(function IGameBoard_countSurroundingLines_Failure() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    gameBoard.placeLine(playerTurn0);

    assertThrows(
        () => {
            const _countThrowDot = gameBoard.countSurroundingLines(0, 0);
        },
    );

    assertThrows(
        () => {
            const _countThrowSpacer = gameBoard.countSurroundingLines(0, 1);
        },
    );

    assertThrows(
        () => {
            const _countThrowLine = gameBoard.countSurroundingLines(1, 0);
        },
    );
});

Deno.test(function IGameBoard_determinePriorityPlayer_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    const playerTurn3 = makePlayerTurn({
        player: playerA,
        turnIndex: 3,

        x: 1,
        y: 2,
    });

    assertEquals(gameBoard.determinePriorityPlayerTurn(1, 1), null);

    gameBoard.placeLine(playerTurn0);
    assertEquals(gameBoard.determinePriorityPlayerTurn(1, 1), playerTurn0);

    gameBoard.placeLine(playerTurn1);
    assertEquals(gameBoard.determinePriorityPlayerTurn(1, 1), playerTurn1);

    gameBoard.placeLine(playerTurn2);
    assertEquals(gameBoard.determinePriorityPlayerTurn(1, 1), playerTurn2);

    gameBoard.placeLine(playerTurn3);
    assertEquals(gameBoard.determinePriorityPlayerTurn(1, 1), playerTurn3);
});

Deno.test(function IGameBoard_determinePriorityPlayer_Failure() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    gameBoard.placeLine(playerTurn0);

    assertThrows(
        () => {
            const _playerThrowDot = gameBoard.determinePriorityPlayerTurn(
                0,
                0,
            );
        },
    );

    assertThrows(
        () => {
            const _playerThrowSpacer = gameBoard.determinePriorityPlayerTurn(
                0,
                1,
            );
        },
    );

    assertThrows(
        () => {
            const _playerThrowLine = gameBoard.determinePriorityPlayerTurn(
                1,
                0,
            );
        },
    );
});

Deno.test(function IGameBoard_applyCaptures_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    const playerTurn3 = makePlayerTurn({
        player: playerB,
        turnIndex: 3,

        x: 1,
        y: 2,
    });

    assertObjectMatch(gameBoard, {
        boxesClaimed: 0,
        remainingBoxes: 8,
    });

    gameBoard.placeLine(playerTurn0);
    gameBoard.placeLine(playerTurn1);
    gameBoard.placeLine(playerTurn2);
    gameBoard.placeLine(playerTurn3);

    const capturesMade = gameBoard.applyCaptures();

    assertTypeOf(capturesMade, 'number');
    assertEquals(capturesMade, 1);

    assertObjectMatch(gameBoard, {
        boxesClaimed: 1,
        remainingBoxes: 7,
    });
});

Deno.test(function IGameBoard_toString_Success() {
    const gameBoard = makeGameBoard({
        rows: 3,
        columns: 5,
    });

    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerTurn0 = makePlayerTurn({
        player: playerA,
        turnIndex: 0,

        x: 1,
        y: 0,
    });

    const playerTurn1 = makePlayerTurn({
        player: playerB,
        turnIndex: 1,

        x: 0,
        y: 1,
    });

    const playerTurn2 = makePlayerTurn({
        player: playerA,
        turnIndex: 2,

        x: 2,
        y: 1,
    });

    const playerTurn3 = makePlayerTurn({
        player: playerB,
        turnIndex: 3,

        x: 1,
        y: 2,
    });

    gameBoard.placeLine(playerTurn0);
    gameBoard.placeLine(playerTurn1);
    gameBoard.placeLine(playerTurn2);
    gameBoard.placeLine(playerTurn3);

    gameBoard.applyCaptures();

    const gameBoardString = gameBoard.toString();

    assertEquals(
        gameBoardString,
        `   0        
   012345678
00 .-. . . .
 1 |B|      
 2 .-. . . .
 3          
 4 . . . . .`,
    );
});
