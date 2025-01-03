import type { OutputKind } from './output_logger.ts';

export interface IGlobalOptions {
    readonly outputFile?: string;

    readonly outputKind: OutputKind;
}
