import { Command } from '@cliffy/command';

import { OUTPUT_KIND, OUTPUT_KIND_ENUM } from './output_logger.ts';
import { COMMAND_SIMULATE } from './simulate.ts';

const IS_WINDOWS = Deno.build.os === 'windows';

const BINARY_NAME = IS_WINDOWS ? 'dotsandboxes.exe' : 'dotsandboxes';

await new Command()
    .name(BINARY_NAME)
    .version('0.0.1')
    .description('Game engine for simulating Dots and Boxes game sessions.')
    .globalType('OutputKind', OUTPUT_KIND_ENUM)
    .globalOption(
        '--output-file [outputFile:file]',
        'Determine the file used for output.',
    )
    .globalOption(
        '--output-kind [outputKind:OutputKind]',
        'Determine the format used for output.',
        { default: OUTPUT_KIND.human },
    )
    .command('simulate', COMMAND_SIMULATE)
    .parse(Deno.args);
