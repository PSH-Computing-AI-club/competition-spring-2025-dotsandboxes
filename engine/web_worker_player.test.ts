import {
    assertInstanceOf,
    assertObjectMatch,
    assertRejects,
} from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeWebWorkerPlayer } from './web_worker_player.ts';
import { makeGameBoard } from './game_board.ts';
import { makeGameSession } from './game_session.ts';

Deno.test(function makeWebWorkerPlayer_Success() {
    const webWorkerPlayer = makeWebWorkerPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    assertTypeOf(webWorkerPlayer, 'object');

    assertTypeOf(webWorkerPlayer.playerInitial, 'string');
    assertInstanceOf(webWorkerPlayer.computePlayerMove, Function);
    assertInstanceOf(webWorkerPlayer.destroy, Function);
    assertInstanceOf(webWorkerPlayer.initialize, Function);

    assertObjectMatch(webWorkerPlayer, {
        playerInitial: 'D',
    });
});

Deno.test(async function IWebWorkerPlayer_computePlayerMove_Failure() {
    const webWorkerPlayer = makeWebWorkerPlayer({
        playerInitial: 'D',
        seed: 0,
    });

    const gameBoard = makeGameBoard({
        columns: 5,
        rows: 3,
    });

    const gameSession = makeGameSession({
        players: [webWorkerPlayer],
        timeout: 0,
    });

    await assertRejects(
        async () => {
            await webWorkerPlayer.computePlayerMove(gameSession, gameBoard);
        },
        "bad dispatch to 'IWebWorkerPlayer.computePlayerMove' (not implemented)",
    );
});
