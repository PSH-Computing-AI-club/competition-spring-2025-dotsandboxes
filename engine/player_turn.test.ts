import { assertEquals } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import { makePlayerMove } from './player_move.ts';
import { makePlayerTurn, makePlayerTurnFromPlayerMove } from './player_turn.ts';

Deno.test(function makePlayerTurn_Success() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const playerTurn = makePlayerTurn({
        player: dummyPlayer,
        turnIndex: 0,

        x: 0,
        y: 3,
    });

    assertTypeOf(playerTurn, 'object');

    assertTypeOf(playerTurn.player, 'object');
    assertTypeOf(playerTurn.x, 'number');
    assertTypeOf(playerTurn.y, 'number');

    assertEquals(playerTurn, {
        player: dummyPlayer,
        turnIndex: 0,

        x: 0,
        y: 3,
    });
});

Deno.test(function makePlayerTurnFromPlayerMove_Success() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const playerMove = makePlayerMove({
        x: 0,
        y: 3,
    });

    const playerTurn = makePlayerTurnFromPlayerMove(playerMove, {
        player: dummyPlayer,
        turnIndex: 0,
    });

    assertTypeOf(playerTurn, 'object');

    assertTypeOf(playerTurn.player, 'object');
    assertTypeOf(playerTurn.x, 'number');
    assertTypeOf(playerTurn.y, 'number');

    assertEquals(playerTurn, {
        player: dummyPlayer,
        turnIndex: 0,

        x: 0,
        y: 3,
    });
});
