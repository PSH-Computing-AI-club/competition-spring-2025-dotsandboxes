import { bundle } from '@deno/emit';
import { createContext, Script } from 'node:vm';
import { fromFileUrl } from '@std/path';

import { IPlayerMove } from '../engine/mod.ts';

import type { IWorkerGlobalThis } from './worker_global_this.ts';

interface IScriptExports {
    readonly default?: IComputePlayerMoveCallback;
}

export type IComputePlayerMoveCallback = () =>
    | Promise<IPlayerMove | null>
    | IPlayerMove
    | null;

export interface IBundlePlayerScriptOptions {
    readonly root: string | URL;
}

export interface IBundlePlayerScriptResult {
    readonly bundle: string;

    readonly sourceMap: string;
}

export interface IEvaluatePlayerScriptOptions {
    readonly bundle: string;

    readonly globalThis: IWorkerGlobalThis;

    readonly timeout: number;
}

export async function bundlePlayerScript(
    options: IBundlePlayerScriptOptions,
): Promise<IBundlePlayerScriptResult> {
    const { root } = options;

    const { code, map } = await bundle(root, {
        allowRemote: false,
        minify: true,
        type: 'classic',

        compilerOptions: {
            sourceMap: true,
        },
    });

    const sourceMap = JSON.parse(map!);

    sourceMap.sources = sourceMap
        .sources
        .map((fileURL: string) => {
            const url = new URL(fileURL);

            return fromFileUrl(url);
        });

    return {
        bundle: code,
        sourceMap: JSON.stringify(sourceMap),
    };
}

export async function evaluatePlayerScript(
    options: IEvaluatePlayerScriptOptions,
): Promise<IComputePlayerMoveCallback | null> {
    const { bundle, globalThis, timeout } = options;

    const context = createContext(globalThis, {
        name: 'IWorkerGlobalThis',
    }) as IWorkerGlobalThis;

    const script = new Script(bundle, {
        filename: 'player.script.vm',
    });

    const exports = await script.runInContext(context, { timeout }) as
        | IScriptExports
        | undefined;

    return exports?.default ?? null;
}
