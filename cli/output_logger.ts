import { EnumType } from '@cliffy/command';
import type { FormatterFunction, Logger } from '@std/log';
import {
    ConsoleHandler,
    FileHandler,
    formatters,
    getLogger,
    setup,
} from '@std/log';
import { dirname } from '@std/path';

import { ValueOf } from '../util/mod.ts';

let CONFIGURED_LOGGER: string;

const FORMATTER_HUMAN: FormatterFunction = ({ msg }) => msg;

export const OUTPUT_KIND = {
    human: 'human',

    jsonl: 'jsonl',
} as const;

export type OutputKind = ValueOf<typeof OUTPUT_KIND>;

export const OUTPUT_KIND_ENUM = new EnumType(Object.values(OUTPUT_KIND));

export function getOutputLogger(): Logger {
    return getLogger(CONFIGURED_LOGGER);
}

export async function setupOutputLogger(
    outputKind: OutputKind,
    fileName?: string,
): Promise<void> {
    if (fileName !== undefined) {
        const directoryPath = dirname(fileName);

        await Deno.mkdir(directoryPath, { recursive: true });
    }

    switch (outputKind) {
        case OUTPUT_KIND.human:
            setup({
                handlers: {
                    [OUTPUT_KIND.human]: (fileName === undefined)
                        ? new ConsoleHandler('INFO', {
                            formatter: FORMATTER_HUMAN,
                        })
                        : new FileHandler('INFO', {
                            filename: fileName,
                            formatter: FORMATTER_HUMAN,
                            mode: 'w',
                        }),
                },

                loggers: {
                    [OUTPUT_KIND.human]: {
                        handlers: [OUTPUT_KIND.human],
                    },
                },
            });

            break;

        case OUTPUT_KIND.jsonl:
            setup({
                handlers: {
                    [OUTPUT_KIND.jsonl]: (fileName === undefined)
                        ? new ConsoleHandler('INFO', {
                            formatter: formatters.jsonFormatter,
                            useColors: false,
                        })
                        : new FileHandler('INFO', {
                            filename: fileName,
                            formatter: formatters.jsonFormatter,
                            mode: 'w',
                        }),
                },

                loggers: {
                    [OUTPUT_KIND.jsonl]: {
                        handlers: [OUTPUT_KIND.jsonl],
                    },
                },
            });

            break;
    }

    CONFIGURED_LOGGER = outputKind;
}
