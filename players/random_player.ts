// Random Player randomly selects from a pool of available lines to draw.

const { board: gameBoard } = Game;
const { SLOT_KIND } = Engine;

export default (() => {
    const availableSpacers = Array.from(gameBoard.walkSpacers())
        .filter(
            (gameBoardSlot) => {
                const { slotKind } = gameBoardSlot;

                return slotKind === SLOT_KIND.spacer;
            },
        );

    const boardSlotIndex = Math.max(
        Math.trunc(
            (availableSpacers.length - 1) * Math.random(),
        ),
        0,
    );

    const gameBoardSlot = availableSpacers[boardSlotIndex];

    if (gameBoardSlot !== undefined) {
        const { x, y } = gameBoardSlot;

        return {
            x,
            y,
        };
    }

    return null;
}) satisfies PlayerScript.IComputePlayerMoveCallback;
