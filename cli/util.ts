const { os: OPERATING_SYSTEM } = Deno.build;

function getBinaryBuildMatch(): string {
    switch (OPERATING_SYSTEM) {
        case 'darwin':
            return 'dotsandboxes-macos';

        case 'linux':
            return 'dotsandboxes-linux';

        case 'windows':
            return 'dotsandboxes-windows.exe';
    }

    throw Error(
        `bad dispatch to 'getBinaryBuildMatch' (unsupported operating system '${OPERATING_SYSTEM}')`,
    );
}

export const BINARY_NAME = getBinaryBuildMatch();
