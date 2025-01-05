import { createContext, Script } from 'node:vm';
import { bundle } from '@deno/emit';

import { IPlayerMove } from '../engine/mod.ts';

import type { IWorkerGlobalThis } from './worker_global_this.ts';

interface IScriptExports {
    readonly default?: IComputePlayerMoveCallback;
}

export type IComputePlayerMoveCallback = () => IPlayerMove | null;

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
            inlineSourceMap: true,
            inlineSources: true,
        },
    });

    return code;
}

export async function evaluatePlayerScript(
    options: IEvaluatePlayerScriptOptions,
): Promise<IComputePlayerMoveCallback | null> {
    const { code, globalThis, timeout } = options;

    const context = createContext(globalThis, {
        name: 'IWorkerGlobalThis',
    }) as IWorkerGlobalThis;

    const script = new Script(code, {
        filename: 'player.script.vm',
    });

    const exports = await script.runInContext(context, { timeout }) as
        | IScriptExports
        | undefined;

    return exports?.default ?? null;
}
