import { Command } from '@cliffy/command';

import type { IGlobalOptions } from './global.ts';
import { setupOutputLogger } from './output_logger.ts';
import { runGameLoop } from './game_loop.ts';

interface ISimulateOptions extends IGlobalOptions {
    readonly gridColumns: number;

    readonly gridRows: number;

    readonly seed: number;

    readonly timeout: number;
}

export const COMMAND_SIMULATE = new Command()
    .description('Simulates a Dots and Boxes game session.')
    .option(
        '--grid-columns [columns:number]',
        'Determine how many columns of dots is in gameboard.',
        { default: 5 },
    )
    .option(
        '--grid-rows [rows:number]',
        'Determine how many rows of dots is in gameboard.',
        { default: 3 },
    ).option(
        '--seed [seed:number]',
        'Determine what value to initially seed random number generators with.',
        { default: Date.now() },
    ).option(
        '--timeout [timeout:number]',
        'Determine how long in milliseconds should each player get to compute their turns.',
        { default: 1000 },
    )
    .arguments('<...files:file>')
    .action(
        // @ts-expect-error - **HACK**: There's currently some weirdness with cliffy's
        // string to type parser causing types like `.gridColumns` being inferred as
        // `number | boolean` rather than just `number`.
        //
        // So we are manually ignoring the inferred typing to focus the actual behaviour.
        async (options: ISimulateOptions, ...files: string[]) => {
            const {
                gridColumns,
                gridRows,
                outputFile,
                outputKind,
                seed,
                timeout,
            } = options;

            await setupOutputLogger(outputKind, outputFile);

            await runGameLoop({
                gridColumns,
                gridRows,
                files,
                seed,
                timeout,
            });
        },
    );
