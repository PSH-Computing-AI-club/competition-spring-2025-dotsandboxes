import { assertEquals, assertInstanceOf, assertObjectMatch } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeConstantPlayer } from './constant_player.ts';
import { makeGameBoard } from './game_board.ts';
import { makeGameSession } from './game_session.ts';

Deno.test(function makeConstantPlayer_Success() {
    const constantPlayer = makeConstantPlayer({
        playerInitial: 'C',
        seed: 0,
        x: 0,
        y: 0,
    });

    assertTypeOf(constantPlayer, 'object');

    assertInstanceOf(constantPlayer.computePlayerMove, Function);
    assertInstanceOf(constantPlayer.toString, Function);

    assertObjectMatch(constantPlayer, {
        playerInitial: 'C',
        x: 0,
        y: 0,
    });
});

Deno.test(async function IConstantPlayer_computePlayerMove_Success() {
    const constantPlayer = makeConstantPlayer({
        playerInitial: 'C',
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

    const playerMove = await constantPlayer.computePlayerMove(
        gameSession,
        gameBoard,
    );

    assertTypeOf(playerMove, 'object');
    assertEquals(playerMove, {
        x: 0,
        y: 0,
    });
});

Deno.test(async function IConstantPlayer_toString_Success() {
    const constantPlayer = makeConstantPlayer({
        playerInitial: 'C',
        seed: 0,
        x: 0,
        y: 0,
    });

    const playerString = constantPlayer.toString();

    assertTypeOf(playerString, 'string');
    assertEquals(playerString, 'builtin:constant_player');
});
