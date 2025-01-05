// ---------- worker/engine_namespace.ts ----------

declare namespace Engine {
    /**
     * Represents an interface to publish event data via a singleton instance, that is compatible with Svelte Store subscriptions.
     */
    interface IEvent<T> {
        /**
         * Dispatches new event details to every subscriber
         * @param details
         */
        dispatch(details: T): void;

        /**
         * Subscribes to new incoming event dispatches.
         * @param callback
         * @returns
         */
        subscribe(callback: Util.IEventCallback<T>): Util.IEventSubscription<T>;
    }

    // ---------- engine/errors.ts ----------

    export interface InvalidPlacementErrorOptions extends ErrorOptions {
        readonly playerTurn: IPlayerTurn;
    }

    export interface InvalidQueryErrorOptions extends ErrorOptions {
        readonly x: number;

        readonly y: number;
    }

    export interface PlayerComputeThrowErrorOptions extends ErrorOptions {
        readonly error: Error;

        readonly player: IPlayer;
    }

    export interface PlayerForfeitErrorOptions extends ErrorOptions {
        readonly player: IPlayer;
    }

    export interface PlayerTimeoutErrorOptions extends ErrorOptions {
        readonly player: IPlayer;
    }

    export class InvalidPlacementError extends Error {
        readonly playerTurn: IPlayerTurn;

        constructor(message: string, options: InvalidPlacementErrorOptions);
    }

    export class InvalidQueryError extends Error {
        readonly x: number;

        readonly y: number;

        constructor(message: string, options: InvalidQueryErrorOptions);
    }
    export class NoNextPlayerError extends Error {
        constructor(message: string, options?: ErrorOptions);
    }

    export class PlayerComputeThrowError extends Error {
        readonly error: Error;

        readonly player: IPlayer;

        constructor(
            message: string,
            options: PlayerComputeThrowErrorOptions,
        );
    }

    export class PlayerForfeitError extends Error {
        readonly player: IPlayer;

        constructor(
            message: string,
            options: PlayerForfeitErrorOptions,
        );
    }

    export class PlayerTimeoutError extends Error {
        readonly player: IPlayer;

        constructor(
            message: string,
            options: PlayerTimeoutErrorOptions,
        );
    }

    // ---------- engine/player.ts ----------

    export interface IPlayerOptions {
        readonly playerInitial: string;

        readonly seed: number;

        toString(): string;
    }

    export interface IPlayer extends IPlayerOptions {
        computePlayerMove(
            gameSession: IGameSession,
            gameBoard: IGameBoard,
        ): Promise<IPlayerMove | null>;
    }

    export type IPlayerConstructor<
        Options extends IPlayerOptions = IPlayerOptions,
        Player extends IPlayer = IPlayer,
    > = (
        options: Options,
    ) => Player;

    // ---------- engine/player_move.ts ----------

    export interface IPlayerMove {
        readonly x: number;

        readonly y: number;
    }

    export function isLegalMove(x: number, y: number): boolean;

    export function makePlayerMove(options: IPlayerMove): IPlayerMove;

    // ---------- engine/player_turn.ts ----------

    export interface IPlayerTurn extends IPlayerMove {
        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export function makePlayerTurn(options: IPlayerTurn): IPlayerTurn;

    export function makePlayerTurnFromPlayerMove(
        moveOptions: IPlayerMove,
        turnOptions: Omit<IPlayerTurn, keyof IPlayerMove>,
    ): IPlayerTurn;

    // ---------- engine/game_board_slot.ts ----------

    export const SLOT_KIND: {
        readonly dot: 'SLOT_DOT';
        readonly box: 'SLOT_BOX';
        readonly initial: 'SLOT_INITIAL';
        readonly spacer: 'SLOT_SPACER';
        readonly line: 'SLOT_LINE';
    };

    export type SlotKind =
        | 'SLOT_DOT'
        | 'SLOT_BOX'
        | 'SLOT_INITIAL'
        | 'SLOT_SPACER'
        | 'SLOT_LINE';

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

    export function determineInitialSlotKind(x: number, y: number): SlotKind;

    export function determinePlacedSlotKind(x: number, y: number): SlotKind;

    export function isHorizontalSpacer(x: number, y: number): boolean;

    export function isVerticalSpacer(x: number, y: number): boolean;

    export function makeGameBoardSlot(
        options: IGameBoardSlotOptions,
    ): IGameBoardSlot;

    // ---------- engine/game_board.ts ----------

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

    export function makeGameBoard(options: IGameBoardOptions): IGameBoard;

    // ---------- engine/game_session.ts ----------

    export interface IPlayerForfeitEvent {
        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export interface IPlayerTimeoutEvent {
        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export interface ITurnErrorEvent {
        readonly error: Error;

        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export interface ITurnEndEvent {
        readonly capturesMade: number;

        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export interface ITurnMoveEvent {
        readonly player: IPlayer;

        readonly playerMove: IPlayerMove;

        readonly turnIndex: number;
    }

    export interface ITurnStartEvent {
        readonly player: IPlayer;

        readonly turnIndex: number;
    }

    export interface IGameSessionOptions {
        readonly gameBoard: IGameBoard;

        readonly players: IPlayer[];

        readonly timeout: number;
    }

    export interface IGameSession extends IGameSessionOptions {
        readonly EVENT_PLAYER_FORFEIT: IEvent<IPlayerForfeitEvent>;

        readonly EVENT_PLAYER_TIMEOUT: IEvent<IPlayerTimeoutEvent>;

        readonly EVENT_TURN_END: IEvent<ITurnEndEvent>;

        readonly EVENT_TURN_ERROR: IEvent<ITurnErrorEvent>;

        readonly EVENT_TURN_MOVE: IEvent<ITurnMoveEvent>;

        readonly EVENT_TURN_START: IEvent<ITurnStartEvent>;

        readonly playerTurns: IPlayerTurn[];

        applyPlayerTurn(playerTurn: IPlayerTurn): number;

        computeNextPlayerTurn(): Promise<IPlayerTurn>;

        shiftTurnOrder(capturesMade: number): void;
    }

    export function makeGameSession(options: IGameSessionOptions): IGameSession;

    // ---------- engine/game_result.ts ----------

    export const WIN_KIND: {
        readonly no_contest: 'WIN_NO_CONTEST';
        readonly singular: 'WIN_SINGULAR';
        readonly multiple: 'WIN_MULTIPLE';
    };

    export type WinKind = 'WIN_NO_CONTEST' | 'WIN_SINGULAR' | 'WIN_MULTIPLE';

    export interface IGameResultOptions {
        readonly scores: ReadonlyMap<IPlayer, number>;
    }

    export interface IGameResult extends IGameResultOptions {
        readonly highestScore: number;

        readonly winKind: WinKind;

        readonly winningPlayers: ReadonlySet<IPlayer>;
    }

    export function makeGameResult(options: IGameResultOptions): IGameResult;

    export function computeGameResultFromGame(
        gameSession: IGameSession,
        gameBoard: IGameBoard,
    ): IGameResult;

    // ---------- engine/constant_player.ts ----------

    export interface IConstantPlayerOptions extends IPlayerOptions {
        readonly x: number;

        readonly y: number;
    }

    export type IConstantPlayer = IPlayer & IConstantPlayerOptions;

    export function makeConstantPlayer(
        options: IConstantPlayerOptions,
    ): IConstantPlayer;

    // ---------- engine/dummy_player.ts ----------

    export type IDummyPlayerOptions = IPlayerOptions;

    export type IDummyPlayer = IPlayer;

    export function makeDummyPlayer(
        options: IDummyPlayerOptions,
    ): IDummyPlayer;

    // ---------- engine/forfeit_player.ts ----------

    export type IForfeitPlayerOptions = IPlayerOptions;

    export type IForfeitPlayer = IPlayer;

    export function makeForfeitPlayer(
        options: IForfeitPlayerOptions,
    ): IForfeitPlayer;
}

// ---------- worker/game_namespace.ts ----------

declare namespace Game {
    export const board: Engine.IGameBoard;

    export const session: Engine.IGameSession;

    export const player: Engine.IPlayer;
}

// ---------- worker/player_script.ts ----------

declare namespace PlayerScript {
    export type IComputePlayerMoveCallback = () =>
        | Promise<Engine.IPlayerMove | null>
        | Engine.IPlayerMove
        | null;
}

declare namespace Util {
    // ---------- util/event.ts ----------

    /**
     * Represents the callback supplied by subscribers to be called every dispatch.
     */
    type IEventCallback<T> = (value: T) => void;

    interface IEventSubscription<T> {
        readonly callback: IEventCallback<T>;

        destroy(): void;
    }
}
