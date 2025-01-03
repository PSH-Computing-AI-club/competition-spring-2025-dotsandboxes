import { assertEquals, assertInstanceOf, assertObjectMatch } from '@std/assert';

import { assertTypeOf } from '../util/mod.ts';

import { makeDummyPlayer } from './dummy_player.ts';
import type { IPlayer } from './player.ts';
import { makeGameResult, WIN_KIND } from './game_result.ts';

Deno.test(function makeGameResult_Success() {
    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const scores = new Map<IPlayer, number>([
        [playerA, 2],
        [playerB, 1],
    ]);

    const gameResult = makeGameResult({
        scores,
    });

    assertTypeOf(gameResult, 'object');

    assertTypeOf(gameResult.highestScore, 'number');
    assertInstanceOf(gameResult.scores, Map);
    assertTypeOf(gameResult.winKind, 'string');
    assertInstanceOf(gameResult.winningPlayers, Set);

    assertTypeOf(gameResult.scores.get(playerA), 'number');
    assertTypeOf(gameResult.scores.get(playerB), 'number');

    const winningPlayersArray = Array.from(gameResult.winningPlayers);

    assertTypeOf(winningPlayersArray[0], 'object');

    assertObjectMatch(gameResult, {
        highestScore: 2,
        scores: new Map([[playerB, 2], [playerB, 1]]),
        winKind: WIN_KIND.singular,
        winningPlayers: new Set([playerA]),
    });
});

Deno.test(function IGameResult_winKind_no_contest_Success() {
    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const scores = new Map<IPlayer, number>([
        [playerA, 0],
        [playerB, 0],
    ]);

    const gameResult = makeGameResult({
        scores,
    });

    assertEquals(gameResult.winKind, WIN_KIND.no_contest);
    assertEquals(gameResult.winningPlayers, new Set());
});

Deno.test(function IGameResult_winKind_singular_Success() {
    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const scores = new Map<IPlayer, number>([
        [playerA, 6],
        [playerB, 9],
    ]);

    const gameResult = makeGameResult({
        scores,
    });

    assertEquals(gameResult.winKind, WIN_KIND.singular);
    assertEquals(gameResult.winningPlayers, new Set([playerB]));
});

Deno.test(function IGameResult_winKind_multiple_Success() {
    const playerA = makeDummyPlayer({
        playerInitial: 'A',
        seed: 0,
    });

    const playerB = makeDummyPlayer({
        playerInitial: 'B',
        seed: 0,
    });

    const playerC = makeDummyPlayer({
        playerInitial: 'C',
        seed: 0,
    });

    const scores = new Map<IPlayer, number>([
        [playerA, 6],
        [playerB, 9],
        [playerC, 9],
    ]);

    const gameResult = makeGameResult({
        scores,
    });

    assertEquals(gameResult.winKind, WIN_KIND.multiple);
    assertEquals(gameResult.winningPlayers, new Set([playerB, playerC]));
});
