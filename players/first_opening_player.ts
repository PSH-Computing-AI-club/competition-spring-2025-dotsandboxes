// First Opening Player finds the first line that is available for it to draw.

const { board: gameBoard } = Game;
const { SLOT_KIND } = Engine;

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
}) satisfies PlayerScript.IComputePlayerTurnCallback;
