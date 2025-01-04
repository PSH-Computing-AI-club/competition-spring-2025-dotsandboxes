import { createContext, Script } from 'node:vm';
import { bundle } from 'jsr:@deno/emit';

import { IPlayerMove } from '../engine/mod.ts';

import type { IWorkerGlobalThis } from './worker_global_this.ts';

export type IComputePlayerTurnCallback = () => IPlayerMove;

export interface IBundlePlayerScriptOptions {
    readonly root: string | URL;
}

export interface IEvaluatePlayerScriptOptions {
    readonly code: string;

    readonly globalThis: IWorkerGlobalThis;

    readonly timeout: number;
}

export async function bundlePlayerScript(
    options: IBundlePlayerScriptOptions,
): Promise<string> {
    const { root } = options;

    const { code } = await bundle(root, {
        allowRemote: false,
        minify: true,
        type: 'classic',

        compilerOptions: {
            checkJs: true,
            inlineSourceMap: true,
            inlineSources: true,
        },
    });

    return code;
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
