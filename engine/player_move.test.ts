import { assertEquals } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { isLegalMove, makePlayerMove } from './player_move.ts';

Deno.test(function isLegalMove_Success() {
    const isLegal = isLegalMove(0, 3);

    assertEquals(isLegal, true);
});

Deno.test(function isLegalMove_Failure() {
    const isLegal = isLegalMove(2, 2);

    assertEquals(isLegal, false);
});

Deno.test(function makePlayerMove_Success() {
    const playerMove = makePlayerMove({
        x: 0,
        y: 3,
    });

    assertTypeOf(playerMove, 'object');

    assertTypeOf(playerMove.x, 'number');
    assertTypeOf(playerMove.y, 'number');

    assertEquals(playerMove, {
        x: 0,
        y: 3,
    });
});
