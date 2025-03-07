// **NOTE:** We want to support player developers being able to simulate games... if
// for whatever reason they want to do that. So, we are exporting the entire engine to
// player environment.

import * as Engine from '../engine/mod_safe.ts';

export type IEngineNamespace = typeof Engine;

export function makeEngineNamespace(): IEngineNamespace {
    const { ...members } = Engine;

    return Object.freeze({
        ...members,
    });
}
