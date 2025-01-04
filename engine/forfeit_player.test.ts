import { assertEquals, assertInstanceOf, assertObjectMatch } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeForfeitPlayer } from './forfeit_player.ts';
import { makeGameBoard } from './game_board.ts';
import { makeGameSession } from './game_session.ts';

Deno.test(function makeForfeitPlayer_Success() {
    const forfeitPlayer = makeForfeitPlayer({
        playerInitial: 'F',
        seed: 0,
    });

    assertTypeOf(forfeitPlayer, 'object');

    assertInstanceOf(forfeitPlayer.computePlayerMove, Function);
    assertInstanceOf(forfeitPlayer.toString, Function);

    assertObjectMatch(forfeitPlayer, {
        playerInitial: 'F',
    });
});

Deno.test(async function IForfeitPlayer_computePlayerMove_Success() {
    const forfeitPlayer = makeForfeitPlayer({
        playerInitial: 'F',
        seed: 0,
    });

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        players: [forfeitPlayer],
        timeout: 0,
    });

    const nullMove = await forfeitPlayer.computePlayerMove(
        gameSession,
        gameBoard,
    );

    assertEquals(nullMove, null);
});

Deno.test(async function IForfeitPlayer_toString_Success() {
    const forfeitPlayer = makeForfeitPlayer({
        playerInitial: 'F',
        seed: 0,
    });

    const playerString = forfeitPlayer.toString();

    assertTypeOf(playerString, 'string');
    assertEquals(playerString, 'builtin:forfeit_player');
});
