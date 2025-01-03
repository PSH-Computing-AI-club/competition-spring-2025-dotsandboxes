import { assertEquals, assertInstanceOf, assertObjectMatch } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import {
    determineInitialSlotKind,
    determinePlacedSlotKind,
    isHorizontalSpacer,
    isVerticalSpacer,
    makeGameBoardSlot,
    SLOT_KIND,
} from './game_board_slot.ts';
import { makePlayerTurn } from './player_turn.ts';

Deno.test(function determineInitialSlotKind_Success() {
    const dotKind = determineInitialSlotKind(0, 0);

    assertTypeOf(dotKind, 'string');
    assertEquals(dotKind, SLOT_KIND.dot);

    const scorableKind = determineInitialSlotKind(1, 1);

    assertTypeOf(scorableKind, 'string');
    assertEquals(scorableKind, SLOT_KIND.box);

    const spacerKind = determineInitialSlotKind(1, 0);

    assertTypeOf(spacerKind, 'string');
    assertEquals(spacerKind, SLOT_KIND.spacer);
});

Deno.test(function determinePlacedSlotKind_Success() {
    const dotKind = determinePlacedSlotKind(0, 0);

    assertTypeOf(dotKind, 'string');
    assertEquals(dotKind, SLOT_KIND.dot);

    const initialKind = determinePlacedSlotKind(1, 1);

    assertTypeOf(initialKind, 'string');
    assertEquals(initialKind, SLOT_KIND.initial);

    const lineKind = determinePlacedSlotKind(1, 0);

    assertTypeOf(lineKind, 'string');
    assertEquals(lineKind, SLOT_KIND.line);
});

Deno.test(function isHorizontalSpacer_Success() {
    const isHorizontalTrue = isHorizontalSpacer(1, 0);
    const isHorizontalFalse = isHorizontalSpacer(0, 1);

    assertEquals(isHorizontalTrue, true);
    assertEquals(isHorizontalFalse, false);
});

Deno.test(function isVerticalSpacer_Success() {
    const isVerticalTrue = isVerticalSpacer(0, 1);
    const isVerticalFalse = isVerticalSpacer(1, 0);

    assertEquals(isVerticalTrue, true);
    assertEquals(isVerticalFalse, false);
});

Deno.test(function makeGameBoardSlotInitial_Success() {
    const gameBoardSlotDot = makeGameBoardSlot({
        x: 0,
        y: 0,
    });

    assertTypeOf(gameBoardSlotDot, 'object');

    assertTypeOf(gameBoardSlotDot.x, 'number');
    assertTypeOf(gameBoardSlotDot.y, 'number');
    assertTypeOf(gameBoardSlotDot.playerTurn, 'object');

    assertTypeOf(gameBoardSlotDot.slotKind, 'string');
    assertInstanceOf(gameBoardSlotDot.isHorizontalSpacer, Function);
    assertInstanceOf(gameBoardSlotDot.isVerticalSpacer, Function);

    assertObjectMatch(gameBoardSlotDot, {
        playerTurn: null,
        slotKind: SLOT_KIND.dot,

        x: 0,
        y: 0,
    });

    const gameBoardSlotScorable = makeGameBoardSlot({
        x: 1,
        y: 1,
    });

    assertTypeOf(gameBoardSlotScorable, 'object');

    assertTypeOf(gameBoardSlotScorable.playerTurn, 'object');

    assertTypeOf(gameBoardSlotScorable.slotKind, 'string');

    assertObjectMatch(gameBoardSlotScorable, {
        playerTurn: null,
        slotKind: SLOT_KIND.box,

        x: 1,
        y: 1,
    });

    const gameBoardSlotSpacer = makeGameBoardSlot({
        x: 1,
        y: 0,
    });

    assertTypeOf(gameBoardSlotSpacer, 'object');

    assertTypeOf(gameBoardSlotSpacer.playerTurn, 'object');

    assertTypeOf(gameBoardSlotSpacer.slotKind, 'string');

    assertObjectMatch(gameBoardSlotSpacer, {
        playerTurn: null,
        slotKind: SLOT_KIND.spacer,

        x: 1,
        y: 0,
    });
});

Deno.test(function makeGameBoardSlotPlaced_Success() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const playerTurn = makePlayerTurn({
        player: dummyPlayer,
        turnIndex: 0,

        x: 1,
        y: 1,
    });

    const gameBoardSlotInitial = makeGameBoardSlot({
        playerTurn,

        x: 1,
        y: 1,
    });

    assertTypeOf(gameBoardSlotInitial, 'object');

    assertTypeOf(gameBoardSlotInitial.playerTurn, 'object');

    assertTypeOf(gameBoardSlotInitial.slotKind, 'string');

    assertObjectMatch(gameBoardSlotInitial, {
        slotKind: SLOT_KIND.initial,

        x: 1,
        y: 1,

        playerTurn: {
            player: dummyPlayer,
            turnIndex: 0,

            x: 1,
            y: 1,
        },
    });

    const gameBoardSlotLine = makeGameBoardSlot({
        x: 1,
        y: 0,

        playerTurn: makePlayerTurn({
            player: dummyPlayer,
            turnIndex: 0,

            x: 1,
            y: 0,
        }),
    });

    assertTypeOf(gameBoardSlotLine, 'object');

    assertTypeOf(gameBoardSlotLine.playerTurn, 'object');

    assertTypeOf(gameBoardSlotLine.slotKind, 'string');

    assertObjectMatch(gameBoardSlotLine, {
        slotKind: SLOT_KIND.line,

        x: 1,
        y: 0,

        playerTurn: {
            player: dummyPlayer,
            turnIndex: 0,

            x: 1,
            y: 0,
        },
    });
});

Deno.test(function IGameBoardSlot_isHorizontalSpacer_Success() {
    const horizontalBoardSlot = makeGameBoardSlot({
        x: 1,
        y: 0,
    });

    const verticalBoardSlot = makeGameBoardSlot({
        x: 0,
        y: 1,
    });

    const isHorizontalTrue = horizontalBoardSlot.isHorizontalSpacer();
    const isHorizontalFalse = verticalBoardSlot.isHorizontalSpacer();

    assertEquals(isHorizontalTrue, true);
    assertEquals(isHorizontalFalse, false);
});

Deno.test(function IGameBoardSlot_isVerticalSpacer_Success() {
    const horizontalBoardSlot = makeGameBoardSlot({
        x: 1,
        y: 0,
    });

    const verticalBoardSlot = makeGameBoardSlot({
        x: 0,
        y: 1,
    });

    const isVerticalTrue = verticalBoardSlot.isVerticalSpacer();
    const isVerticalFalse = horizontalBoardSlot.isVerticalSpacer();

    assertEquals(isVerticalTrue, true);
    assertEquals(isVerticalFalse, false);
});

Deno.test(function IGameBoardSlot_toString_Success() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const playerTurn = makePlayerTurn({
        player: dummyPlayer,
        turnIndex: 0,

        x: 1,
        y: 1,
    });

    const dotBoardSlot = makeGameBoardSlot({
        x: 0,
        y: 0,
    });

    const boxBoardSlot = makeGameBoardSlot({
        x: 1,
        y: 1,
    });

    const spacerBoardSlot = makeGameBoardSlot({
        x: 1,
        y: 0,
    });

    const initialBoardSlot = makeGameBoardSlot({
        playerTurn,

        x: 1,
        y: 1,
    });

    const horizontalLineSlot = makeGameBoardSlot({
        playerTurn,

        x: 1,
        y: 0,
    });

    const verticalLineSlot = makeGameBoardSlot({
        playerTurn,

        x: 0,
        y: 1,
    });

    const dotString = dotBoardSlot.toString();
    const boxString = boxBoardSlot.toString();
    const spacerString = spacerBoardSlot.toString();
    const initialString = initialBoardSlot.toString();
    const horizontalLineString = horizontalLineSlot.toString();
    const verticalLineString = verticalLineSlot.toString();

    assertEquals(dotString, '.');
    assertEquals(boxString, ' ');
    assertEquals(spacerString, ' ');
    assertEquals(initialString, 'D');
    assertEquals(horizontalLineString, '-');
    assertEquals(verticalLineString, '|');
});
