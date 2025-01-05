// First Opening Player finds the first line that is available for it to draw.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

export default (() => {
    for (const gameBoardSlot of gameBoard.walkSpacers()) {
        const { slotKind } = gameBoardSlot;

        if (slotKind === SLOT_KIND.spacer) {
            const { x, y } = gameBoardSlot;

            return {
                x,
                y,
            };
        }
    }

    return null;
}) satisfies PlayerScript.IComputePlayerMoveCallback;
