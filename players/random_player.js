const { board: gameBoard } = globalThis.Game;
const { SLOT_KIND } = globalThis.Engine;

export default () => {
    const availableSpacers = Array.from(gameBoard.walkSpacers())
        .filter(
            (gameBoardSlot) => gameBoardSlot.slotKind === SLOT_KIND.spacer,
        );

    const boardSlotIndex = Math.trunc(
        (availableSpacers.length - 1) * Math.random(),
    );

    const gameBoardSlot = availableSpacers[boardSlotIndex];

    if (gameBoardSlot === undefined) return null;

    const { x, y } = gameBoardSlot;

    return {
        x,
        y,
    };
};
