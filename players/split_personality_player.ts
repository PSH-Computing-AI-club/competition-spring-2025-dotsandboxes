// Split Personality Player randomly selects two of the sample players to use
// for a match. During a game session the player randomly selected between
// the two selected players to use for a move computation.

import { sampleArray } from './common.ts';

import FirstOpeningPlayer from './first_opening_player.ts';
import EdgingPlayer from './edging_player.ts';
import GreedyPlayer from './greedy_player.ts';
import RandomPlayer from './random_player.ts';
import StrategicPlayer from './strategic_player.ts';

const AGGRESSIVE_PERSONALITY = sampleArray([
    GreedyPlayer,
    StrategicPlayer,
])!;

const DOOFUS_PERSONALITY = sampleArray([
    FirstOpeningPlayer,
    EdgingPlayer,
    RandomPlayer,
])!;

export default (() => {
    return Math.random() >= 0.25
        ? AGGRESSIVE_PERSONALITY()
        : DOOFUS_PERSONALITY();
}) satisfies PlayerScript.IComputePlayerMoveCallback;
