import { assertEquals, assertObjectMatch } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeForfeitPlayer } from './forfeit_player.ts';
import { makeGameBoard } from './game_board.ts';
import { makeGameSession } from './game_session.ts';

Deno.test(function makeForfeitPlayer_Success() {
    const ForfeitPlayer = makeForfeitPlayer({
        playerInitial: 'F',
        seed: 0,
    });

    assertTypeOf(ForfeitPlayer, 'object');

    assertTypeOf(ForfeitPlayer.playerInitial, 'string');

    assertObjectMatch(ForfeitPlayer, {
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
