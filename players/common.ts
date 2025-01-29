// Common utility functions are found here.

const { SLOT_KIND } = Engine;
const { board: gameBoard } = Game;

const { grid } = gameBoard;

export function getAdjacentSpacerSlots(
    boxBoardSlot: Engine.IBoxBoardSlot,
): Engine.ISpacerBoardSlot[] {
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

export function sampleArray<T>(array: T[]): T | null {
    const elementIndex = Math.trunc(Math.random() * array.length);

    return array[elementIndex] ?? null;
}

export function shuffleArray<T extends unknown[]>(array: T): T {
    const shallowClone = [...array] as T;

    for (let index = 0; index < shallowClone.length - 1; index++) {
        const randomDelta = Math.trunc(
            Math.random() * (shallowClone.length - index),
        );

        const randomIndex = index + randomDelta;

        [shallowClone[index], shallowClone[randomIndex]] = [
            shallowClone[randomIndex],
            shallowClone[index],
        ];
    }

    return shallowClone;
}
