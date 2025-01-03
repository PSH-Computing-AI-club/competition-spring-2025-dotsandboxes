import type { ValueOf } from '../util/mod.ts';

import type { IPlayerTurn } from './player_turn.ts';

export const SLOT_KIND = {
    dot: 'SLOT_DOT',

    box: 'SLOT_BOX',

    initial: 'SLOT_INITIAL',

    spacer: 'SLOT_SPACER',

    line: 'SLOT_LINE',
} as const;

export type SlotKind = ValueOf<typeof SLOT_KIND>;

export interface IGameBoardSlotOptions {
    readonly playerTurn?: IPlayerTurn | null;

    readonly x: number;

    readonly y: number;
}

export interface IBaseBoardSlot extends Required<IGameBoardSlotOptions> {
    readonly slotKind: SlotKind;

    isHorizontalSpacer(): boolean;

    isVerticalSpacer(): boolean;
}

export interface IBoxBoardSlot extends IBaseBoardSlot {
    readonly playerTurn: null;

    readonly slotKind: typeof SLOT_KIND['box'];
}

export interface IDotBoardSlot extends IBaseBoardSlot {
    readonly playerTurn: null;

    readonly slotKind: typeof SLOT_KIND['dot'];
}

export interface IInitialBoardSlot extends IBaseBoardSlot {
    readonly playerTurn: IPlayerTurn;

    readonly slotKind: typeof SLOT_KIND['initial'];
}

export interface ILineBoardSlot extends IBaseBoardSlot {
    readonly playerTurn: IPlayerTurn;

    readonly slotKind: typeof SLOT_KIND['line'];
}

export interface ISpacerBoardSlot extends IBaseBoardSlot {
    readonly playerTurn: null;

    readonly slotKind: typeof SLOT_KIND['spacer'];

    toString(): string;
}

export type IBoxLikeBoardSlot = IBoxBoardSlot | IInitialBoardSlot;

export type ISpacerLikeBoardSlot = ILineBoardSlot | ISpacerBoardSlot;

export type IGameBoardSlot =
    | IBoxBoardSlot
    | IDotBoardSlot
    | IInitialBoardSlot
    | ILineBoardSlot
    | ISpacerBoardSlot;

export function determineInitialSlotKind(x: number, y: number): SlotKind {
    if (x % 2 === 0 && y % 2 === 0) {
        return SLOT_KIND.dot;
    } else if (x % 2 == 1 && y % 2 == 1) {
        return SLOT_KIND.box;
    }

    return SLOT_KIND.spacer;
}

export function determinePlacedSlotKind(x: number, y: number): SlotKind {
    if (x % 2 === 0 && y % 2 === 0) {
        return SLOT_KIND.dot;
    } else if (x % 2 === 1 && y % 2 === 1) {
        return SLOT_KIND.initial;
    }

    return SLOT_KIND.line;
}

export function isHorizontalSpacer(x: number, y: number): boolean {
    return x % 2 === 1 && y % 2 === 0;
}

export function isVerticalSpacer(x: number, y: number): boolean {
    return x % 2 === 0 && y % 2 === 1;
}

export function makeGameBoardSlot(
    options: IGameBoardSlotOptions,
): IGameBoardSlot {
    const { playerTurn = null, x, y } = options;

    const slotKind = playerTurn
        ? determinePlacedSlotKind(x, y)
        : determineInitialSlotKind(x, y);

    return {
        slotKind,
        playerTurn,
        x,
        y,

        isHorizontalSpacer() {
            return isHorizontalSpacer(x, y);
        },

        isVerticalSpacer() {
            return isVerticalSpacer(x, y);
        },

        toString() {
            switch (slotKind) {
                case SLOT_KIND.dot:
                    return '.';

                case SLOT_KIND.box:
                    return ' ';

                case SLOT_KIND.initial:
                    return playerTurn!.player.playerInitial;

                case SLOT_KIND.spacer:
                    return ' ';

                case SLOT_KIND.line:
                    return isHorizontalSpacer(x, y) ? '-' : '|';
            }
        },
    } as IGameBoardSlot;
}
