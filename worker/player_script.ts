import { createContext, Script } from 'node:vm';

import { IPlayerMove } from '../engine/mod.ts';

import type { IWorkerGlobalThis } from './worker_global_this.ts';

export type IComputePlayerTurnCallback = () => IPlayerMove;

export interface IEvaluatePlayerScriptOptions {
    readonly code: string;

    readonly globalThis: IWorkerGlobalThis;

    readonly timeout: number;
}

export async function evaluatePlayerScript(
    options: IEvaluatePlayerScriptOptions,
): Promise<void> {
    const { code, globalThis, timeout } = options;

    const context = createContext(globalThis, {
        name: 'IWorkerGlobalThis',
    }) as IWorkerGlobalThis;

    const script = new Script(code, {
        filename: 'player.script.vm',
    });

    await script.runInContext(context, { timeout });
}
