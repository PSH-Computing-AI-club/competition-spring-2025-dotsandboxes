// Common utility functions are found here.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

const { grid } = gameBoard;

export function getAdjacentSpacerSlots(boxBoardSlot) {
    const { x, y } = boxBoardSlot;

    return [
        grid[y - 1][x],
        grid[y + 1][x],
        grid[y][x - 1],
        grid[y][x + 1],
    ].filter((gameBoardSlot) => {
        const { slotKind } = gameBoardSlot;

        return slotKind === SLOT_KIND.spacer;
    });
}

export function sampleArray(array) {
    const elementIndex = Math.trunc(Math.random() * array.length);

    return array[elementIndex] ?? null;
}
