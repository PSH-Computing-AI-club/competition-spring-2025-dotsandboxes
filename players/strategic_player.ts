// Strategic Player makes pools of boxes that have not been captured yet in the
// following priority:
//
// - Boxes with 3 surrounding lines.
// - Boxes with 1 or 0 surrounding lines.
// - Boxes with 2 surrounding lines.
//
// Each priority of boxes is checked in order for if there are available boxes
// matching that priority. Once an available box is found, the player picks
// a random available line to draw surrounding that box as its move.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

function sampleArray<T>(array: T[]): T | null {
    const elementIndex = Math.trunc(
        (array.length - 1) * Math.random(),
    );

    return array[elementIndex] ?? null;
}

function findPrioritySpacer(
    gameBoardSlots: Engine.IBoxBoardSlot[],
    ...priorityLineCounts: number[]
): Engine.ISpacerBoardSlot | null {
    const priorityBoxSlots = gameBoardSlots.filter(
        (gameBoardSlot) => {
            const { x, y } = gameBoardSlot;

            const surroundingLines = gameBoard.countSurroundingLines(x, y);

            return priorityLineCounts.includes(surroundingLines);
        },
    );

    const priorityBoxSlot = sampleArray(priorityBoxSlots);

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

    return sampleArray(sideSpacerSlots);
}

export default (() => {
    const availableSpacers = gameBoard
        .walkBoxes()
        .filter(
            (gameBoardSlot) => {
                const { slotKind } = gameBoardSlot;

                return slotKind === SLOT_KIND.box;
            },
        )
        .toArray();

    const gameBoardSlot = findPrioritySpacer(availableSpacers, 3) ??
        findPrioritySpacer(availableSpacers, 1, 0) ??
        findPrioritySpacer(availableSpacers, 2);

    if (gameBoardSlot !== null) {
        const { x, y } = gameBoardSlot;

        return {
            x,
            y,
        };
    }

    return null;
}) satisfies PlayerScript.IComputePlayerMoveCallback;
