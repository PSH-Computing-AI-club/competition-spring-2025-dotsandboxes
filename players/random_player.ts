// Random Player randomly selects from a pool of available lines to draw.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

function sampleArray<T>(array: T[]): T | null {
    const elementIndex = Math.trunc(
        (array.length - 1) * Math.random(),
    );

    return array[elementIndex] ?? null;
}

export default (() => {
    const availableSpacers = gameBoard
        .walkSpacers()
        .filter(
            (gameBoardSlot) => {
                const { slotKind } = gameBoardSlot;

                return slotKind === SLOT_KIND.spacer;
            },
        )
        .toArray();

    const gameBoardSlot = sampleArray(availableSpacers);

    if (gameBoardSlot !== null) {
        const { x, y } = gameBoardSlot;

        return {
            x,
            y,
        };
    }

    return null;
}) satisfies PlayerScript.IComputePlayerMoveCallback;
