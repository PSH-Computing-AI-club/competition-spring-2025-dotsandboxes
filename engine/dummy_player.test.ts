import { assertObjectMatch, assertThrows } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import { makeGameBoard } from './game_board.ts';
import { makeGameSession } from './game_session.ts';

Deno.test(function makeDummyPlayer_Success() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    assertTypeOf(dummyPlayer, 'object');

    assertTypeOf(dummyPlayer.playerInitial, 'string');

    assertObjectMatch(dummyPlayer, {
        playerInitial: 'D',
    });
});

Deno.test(function IDummyPlayer_computePlayerMove_Failure() {
    const dummyPlayer = makeDummyPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        players: [dummyPlayer],
        timeout: 0,
    });

    assertThrows(() => {
        dummyPlayer.computePlayerMove(gameSession, gameBoard);
    }, "bad dispatch to 'IDummyPlayer.computePlayerMove' (not implemented)");
});
