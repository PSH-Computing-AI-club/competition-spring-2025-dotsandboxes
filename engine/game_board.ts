import type { IEvent } from '../util/mod.ts';
import { event } from '../util/mod.ts';

import { InvalidPlacementError, InvalidQueryError } from './errors.ts';
import type {
    IBoxBoardSlot,
    IBoxLikeBoardSlot,
    IDotBoardSlot,
    IGameBoardSlot,
    IInitialBoardSlot,
    ILineBoardSlot,
    ISpacerBoardSlot,
    ISpacerLikeBoardSlot,
} from './game_board_slot.ts';
import { makeGameBoardSlot, SLOT_KIND } from './game_board_slot.ts';
import type { IPlayerTurn } from './player_turn.ts';

export interface IAppliedCaptureEvent {
    readonly newBoardSlot: IInitialBoardSlot;

    readonly oldBoardSlot: IBoxBoardSlot;
}

export interface IPlacedLineEvent {
    readonly newBoardSlot: ILineBoardSlot;

    readonly oldBoardSlot: ISpacerBoardSlot;

    readonly playerTurn: IPlayerTurn;
}

export interface IGameBoardOptions {
    readonly columns: number;

    readonly rows: number;
}

export interface IGameBoard extends IGameBoardOptions {
    readonly EVENT_APPLIED_CAPTURE: IEvent<IAppliedCaptureEvent>;

    readonly EVENT_PLACED_LINE: IEvent<IPlacedLineEvent>;

    readonly boxesClaimed: number;

    readonly columnPadding: number;

    readonly expandedColumns: number;

    readonly expandedRows: number;

    readonly horizontalSpacers: number;

    readonly grid: readonly (readonly IGameBoardSlot[])[];

    readonly remainingBoxes: number;

    readonly remainingSpacers: number;

    readonly rowPadding: number;

    readonly spacersClaimed: number;

    readonly totalBoxes: number;

    readonly totalSpacers: number;

    readonly verticalSpacers: number;

    applyCaptures(): number;

    countSurroundingLines(x: number, y: number): number;

    determinePriorityPlayerTurn(x: number, y: number): IPlayerTurn | null;

    placeLine(playerTurn: IPlayerTurn): void;

    toString(): string;

    walkBoxes(): Generator<IBoxLikeBoardSlot>;

    walkDots(): Generator<IDotBoardSlot>;

    walkSpacers(): Generator<ISpacerLikeBoardSlot>;
}

export function makeGameBoard(options: IGameBoardOptions): IGameBoard {
    const { columns, rows } = options;

    const EVENT_APPLIED_CAPTURE = event<IAppliedCaptureEvent>();
    const EVENT_PLACED_LINE = event<IPlacedLineEvent>();

    let boxesClaimed = 0;
    let spacersClaimed = 0;

    const columnPadding = columns - 1;
    const rowPadding = rows - 1;

    const expandedColumns = columns + columnPadding;
    const expandedRows = rows + rowPadding;

    const horizontalSpacers = rows * columnPadding;
    const verticalSpacers = columns * rowPadding;

    const totalBoxes = columnPadding * rowPadding;
    const totalSpacers = horizontalSpacers + verticalSpacers;

    const grid: readonly IGameBoardSlot[][] = new Array(expandedRows)
        .fill(null)
        .map((_value, y) =>
            new Array(expandedColumns)
                .fill(null)
                .map((_value, x) => makeGameBoardSlot({ x, y }))
        );

    return {
        EVENT_APPLIED_CAPTURE,
        EVENT_PLACED_LINE,

        columns,
        rows,

        columnPadding,
        expandedColumns,
        expandedRows,
        rowPadding,

        horizontalSpacers,
        totalBoxes,
        totalSpacers,
        verticalSpacers,

        grid,

        get boxesClaimed() {
            return boxesClaimed;
        },

        get spacersClaimed() {
            return spacersClaimed;
        },

        get remainingBoxes() {
            return totalBoxes - boxesClaimed;
        },

        get remainingSpacers() {
            return totalSpacers - spacersClaimed;
        },

        applyCaptures() {
            let claimsMade = 0;

            for (const oldBoardSlot of this.walkBoxes()) {
                if (oldBoardSlot.slotKind !== SLOT_KIND.box) continue;

                const { x, y } = oldBoardSlot;
                const lineCount = this.countSurroundingLines(x, y);

                if (lineCount < 4) continue;

                const playerTurn = this.determinePriorityPlayerTurn(x, y);

                if (playerTurn === null) continue;

                const newBoardSlot = makeGameBoardSlot({
                    ...oldBoardSlot,
                    playerTurn,
                }) as IInitialBoardSlot;

                grid[y][x] = newBoardSlot;
                claimsMade += 1;

                EVENT_APPLIED_CAPTURE.dispatch({
                    newBoardSlot,
                    oldBoardSlot,
                });
            }

            boxesClaimed += claimsMade;

            return claimsMade;
        },

        countSurroundingLines(x, y) {
            const { slotKind } = grid[y][x];

            if (
                (slotKind !== SLOT_KIND.box) &&
                (slotKind !== SLOT_KIND.initial)
            ) {
                throw new InvalidQueryError(
                    `bad arguments #0, #1 to 'IGameBoard.countSurroundingLines' (gameboard slot at '(${x}, ${y})' is not a box or initial kind)`,
                    { x, y },
                );
            }

            let lines: number = 0;

            const downBoardSlot = grid[y - 1][x];
            const leftBoardSlot = grid[y][x - 1];
            const rightBoardSlot = grid[y][x + 1];
            const upBoardSlot = grid[y + 1][x];

            for (
                const adjacentSlot of [
                    downBoardSlot,
                    leftBoardSlot,
                    rightBoardSlot,
                    upBoardSlot,
                ]
            ) {
                if (adjacentSlot.slotKind === SLOT_KIND.line) lines += 1;
            }

            return lines;
        },

        determinePriorityPlayerTurn(x, y) {
            const { slotKind } = grid[y][x];

            if (
                (slotKind !== SLOT_KIND.box) &&
                (slotKind !== SLOT_KIND.initial)
            ) {
                throw new InvalidQueryError(
                    `bad arguments #0, #1 to 'IGameBoard.determinePriorityPlayer' (gameboard slot at '(${x}, ${y})' is not a box or initial kind)`,
                    { x, y },
                );
            }

            const downBoardSlot = grid[y - 1][x];
            const leftBoardSlot = grid[y][x - 1];
            const rightBoardSlot = grid[y][x + 1];
            const upBoardSlot = grid[y + 1][x];

            let priorityTurn: IPlayerTurn | null = null;

            for (
                const adjacentSlot of [
                    downBoardSlot,
                    leftBoardSlot,
                    rightBoardSlot,
                    upBoardSlot,
                ]
            ) {
                if (adjacentSlot.slotKind !== SLOT_KIND.line) continue;

                const { playerTurn } = adjacentSlot;
                if (playerTurn === null) continue;

                if (
                    priorityTurn === null ||
                    (playerTurn.turnIndex > priorityTurn.turnIndex)
                ) {
                    priorityTurn = playerTurn;
                }
            }

            return priorityTurn;
        },

        placeLine(playerTurn) {
            const { x, y } = playerTurn;
            const oldBoardSlot = grid[y][x];

            if (oldBoardSlot.slotKind !== SLOT_KIND.spacer) {
                throw new InvalidPlacementError(
                    `bad members 'IPlayerTurn.x' / 'IPlayerTurn.y' in argument #0 to 'IGameBoard.placeLine' (gameboard slot at '(${x}, ${y})' is not a spacer kind)`,
                    { playerTurn },
                );
            }

            const newBoardSlot = makeGameBoardSlot({
                ...oldBoardSlot,
                playerTurn,
            }) as ILineBoardSlot;

            grid[y][x] = newBoardSlot;
            spacersClaimed += 1;

            EVENT_PLACED_LINE.dispatch({
                newBoardSlot,
                oldBoardSlot,
                playerTurn,
            });
        },

        toString() {
            let buffer = '';

            for (let x: number = 0; x <= expandedColumns; x++) {
                const columnLegend: number = (x - 1) % 10;
                const columnUberLegend: number = Math.floor(x / 10);

                if (columnLegend === 0) buffer += columnUberLegend.toString();
                else buffer += x == 0 ? '   ' : ' ';
            }

            buffer += '\n';

            for (let x: number = 0; x <= expandedColumns; x++) {
                if (x === 0) {
                    buffer += '   ';
                    continue;
                }

                const columnLegend: number = (x - 1) % 10;

                buffer += columnLegend;
            }

            buffer += '\n';

            for (let y: number = 0; y < expandedRows; y++) {
                const rowLegend = y % 10;
                const rowUberLegend = Math.floor(y / 10);

                if (rowLegend === 0) {
                    buffer += rowUberLegend.toString() + rowLegend + ' ';
                } else buffer += ' ' + rowLegend + ' ';

                const row: IGameBoardSlot[] = grid[y];

                for (const gameBoardSlot of row) {
                    buffer += gameBoardSlot.toString();
                }

                if (y < (expandedRows - 1)) buffer += '\n';
            }

            return buffer;
        },

        *walkBoxes() {
            for (let y: number = 1; y < grid.length; y += 2) {
                const columns = grid[y];

                for (let x: number = 1; x < columns.length; x += 2) {
                    const gameBoardSlot = columns[x];

                    yield gameBoardSlot as IBoxLikeBoardSlot;
                }
            }
        },

        *walkDots() {
            for (let y: number = 0; y < grid.length; y += 2) {
                const columns = grid[y];

                for (let x: number = 0; x < columns.length; x += 2) {
                    const gameBoardSlot = columns[x];

                    yield gameBoardSlot as IDotBoardSlot;
                }
            }
        },

        *walkSpacers() {
            for (let y: number = 0; y < grid.length; y += 2) {
                const columns = grid[y];

                for (let x: number = 1; x < columns.length; x += 2) {
                    const gameBoardSlot = columns[x];

                    yield gameBoardSlot as ISpacerLikeBoardSlot;
                }
            }

            for (let y: number = 1; y < grid.length; y += 2) {
                const columns = grid[y];

                for (let x: number = 0; x < columns.length; x += 2) {
                    const gameBoardSlot = columns[x];

                    yield gameBoardSlot as ISpacerLikeBoardSlot;
                }
            }
        },
    };
}
