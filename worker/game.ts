import * as EngineModule from '../engine/mod.ts';

export interface IGameGlobal {
    readonly engine: typeof EngineModule;
}

export function makeGameGlobal(): IGameGlobal {
    return Object.seal({
        engine: EngineModule,
    });
}
