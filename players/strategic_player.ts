// Strategic Player makes pools of boxes that have not been captured yet in the
// following priority:
//
// - Boxes with 3 surrounding lines.
// - Boxes with 1 or 0 surrounding lines.
// - Boxes with 2 surrounding lines.
//
// Each priority of boxes is checked in order for if there are available boxes
// matching that priority. Once an available box is found, the player a random
// available line to draw surrounding that box as its move.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

function sampleBoardSlots<T extends Engine.IGameBoardSlot>(
    gameBoardSlots: T[],
): T | null {
    const boardSlotIndex = Math.trunc(
        (gameBoardSlots.length - 1) * Math.random(),
    );

    const gameBoardSlot = gameBoardSlots[boardSlotIndex];

    return gameBoardSlot ?? null;
}

function prioritizeBoxSlot(
    gameBoardSlots: Engine.IBoxBoardSlot[],
    ...priorityLineCounts: number[]
): Engine.IGameBoardSlot | null {
    const priorityBoxSlots = gameBoardSlots.filter(
        (gameBoardSlot) => {
            const { x, y } = gameBoardSlot;

            const surroundingLines = gameBoard.countSurroundingLines(x, y);

            return priorityLineCounts.includes(surroundingLines);
        },
    );

    const priorityBoxSlot = sampleBoardSlots(priorityBoxSlots);

    if (priorityBoxSlot === null) return null;

    const { grid } = gameBoard;
    const { x, y } = priorityBoxSlot;

    const sideSpacerSlots = [
        grid[y - 1][x],
        grid[y + 1][x],
        grid[y][x - 1],
        grid[y][x + 1],
    ].filter((gameBoardSlot) => {
        const { slotKind } = gameBoardSlot;

        return slotKind === SLOT_KIND.spacer;
    });

    return sampleBoardSlots(sideSpacerSlots);
}

export default (() => {
    const availableSpacers = Array.from(gameBoard.walkBoxes()).filter(
        (gameBoardSlot) => {
            const { slotKind } = gameBoardSlot;

            return slotKind === SLOT_KIND.box;
        },
    );

    const firstPrioritySpacer = prioritizeBoxSlot(availableSpacers, 3);

    if (firstPrioritySpacer !== null) {
        const { x, y } = firstPrioritySpacer;

        return {
            x,
            y,
        };
    }

    const secondPrioritySpacer = prioritizeBoxSlot(availableSpacers, 1, 0);

    if (secondPrioritySpacer !== null) {
        const { x, y } = secondPrioritySpacer;

        return {
            x,
            y,
        };
    }

    const thirdPrioritySpacer = prioritizeBoxSlot(availableSpacers, 2);

    if (thirdPrioritySpacer !== null) {
        const { x, y } = thirdPrioritySpacer;

        return {
            x,
            y,
        };
    }

    return null;
}) satisfies PlayerScript.IComputePlayerMoveCallback;
