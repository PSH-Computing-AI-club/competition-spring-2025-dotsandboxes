/**
 * Hello World
 *
 * @showCategories
 * @module
 */

/**
 * Utility Global APIs
 *
 * @category Util
 */
declare namespace Util {
    // ---------- util/event.ts ----------

    /**
     * Represents the callback supplied by subscribers to be called every dispatch.
     *
     * @category Util
     */
    type IEventCallback<T> = (value: T) => void;

    /**
     * Represents an interface to publish event data via a singleton instance.
     *
     * @category Util
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
        subscribe(callback: IEventCallback<T>): IEventSubscription<T>;
    }

    /**
     * Represents an inteface for a subscribed event callback that can be destroyed.
     *
     * @category Util
     */
    interface IEventSubscription<T> {
        readonly callback: IEventCallback<T>;

        destroy(): void;
    }
}

/**
 * Game Engine Global APIs
 *
 * @category Engine
 */
declare namespace Engine {
    // ---------- worker/engine_namespace.ts ----------

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
        readonly EVENT_APPLIED_CAPTURE: Util.IEvent<IAppliedCaptureEvent>;

        readonly EVENT_PLACED_LINE: Util.IEvent<IPlacedLineEvent>;

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
        readonly EVENT_PLAYER_FORFEIT: Util.IEvent<IPlayerForfeitEvent>;

        readonly EVENT_PLAYER_TIMEOUT: Util.IEvent<IPlayerTimeoutEvent>;

        readonly EVENT_TURN_END: Util.IEvent<ITurnEndEvent>;

        readonly EVENT_TURN_ERROR: Util.IEvent<ITurnErrorEvent>;

        readonly EVENT_TURN_MOVE: Util.IEvent<ITurnMoveEvent>;

        readonly EVENT_TURN_START: Util.IEvent<ITurnStartEvent>;

        readonly playerTurns: IPlayerTurn[];

        applyPlayerTurn(playerTurn: IPlayerTurn): number;

        computeNextPlayerTurn(): Promise<IPlayerTurn>;

        shiftTurnOrder(capturesMade: number): void;
    }

    /**
     * Returns a new {@link Engine.IGameSession} instance.
     *
     * @category Engine
     *
     * @param options Options to {@link Engine.IGameSession}.
     * @returns The configured {@link Engine.IGameSession} instance.
     */
    export function makeGameSession(options: IGameSessionOptions): IGameSession;

    // ---------- engine/game_result.ts ----------

    /**
     * Represents an enumeration of all possible win kind identifiers
     * there are.
     *
     * @enum
     * @category Engine
     */
    export const WIN_KIND: {
        /**
         * Represents that no players in a Dots and Boxes game scored
         * any points.
         *
         * > **NOTE**: This could be due to players forfeiting or
         * > stalemating.
         */
        readonly no_contest: 'WIN_NO_CONTEST';

        /**
         * Represents that a single player won the Dots and Boxes game.
         */
        readonly singular: 'WIN_SINGULAR';

        /**
         * Represents the multiple players won a Dots and Boxes game.
         *
         * > **NOTE**: This is due to the highest score calculated
         * > was by multiple players.
         */
        readonly multiple: 'WIN_MULTIPLE';
    };

    /**
     * Represents a string union of all possible win kind identifiers
     * there are.
     *
     * @category Engine
     */
    export type WinKind = 'WIN_NO_CONTEST' | 'WIN_SINGULAR' | 'WIN_MULTIPLE';

    /**
     * Represents options passed to {@link Engine.makeGameResult}.
     *
     * @category Engine
     */
    export interface IGameResultOptions {
        /**
         * Represents a mapping of players and their current scores.
         */
        readonly scores: ReadonlyMap<IPlayer, number>;
    }

    /**
     * Represents the computed scoring result of a game state.
     *
     * @category Engine
     */
    export interface IGameResult extends IGameResultOptions {
        /**
         * Represents the highest score found in {@link Engine.IGameResultOptions.scores}.
         */
        readonly highestScore: number;

        /**
         * Represents what kind of win condition that was computed
         * from the scores found in {@link Engine.IGameResultOptions.scores}.
         */
        readonly winKind: WinKind;

        /**
         * Represents a set containing the players who has the
         * highest scores found in {@link Engine.IGameResultOptions.scores}.
         */
        readonly winningPlayers: ReadonlySet<IPlayer>;
    }

    /**
     * Returns a new instance of {@link Engine.IGameResult}.
     *
     * @category Engine
     *
     * @param options Options to configure {@link Engine.IGameResult}.
     * @returns The configured {@link Engine.IGameResult} instance.
     */
    export function makeGameResult(options: IGameResultOptions): IGameResult;

    /**
     * Returns a computed scoring result of a Dots and Boxes given any game
     * session and game board.
     *
     * @category Engine
     *
     * @param gameSession {@link Engine.IGameSession} instance to pull data from.
     * @param gameBoard {@link Engine.IGameBoard} instance to pull data from.
     * @returns The configured {@link Engine.IGameResult} instance.
     */
    export function computeGameResultFromGame(
        gameSession: IGameSession,
        gameBoard: IGameBoard,
    ): IGameResult;

    // ---------- engine/constant_player.ts ----------

    /**
     * Represents the options passed to {@link Engine.makeConstantPlayer}.
     *
     * @category Engine
     */
    export interface IConstantPlayerOptions extends IPlayerOptions {
        /**
         * Represents the x-coordinate that the {@link Engine.IConstantPlayer}
         * will always compute.
         */
        readonly x: number;

        /**
         * Represents the y-coordinate that the {@link Engine.IConstantPlayer}
         * will always compute.
         */
        readonly y: number;
    }

    /**
     * Represents an AI Player that always returns a move at a specific
     * set of coordinates when it is their turn to compute a move.
     *
     * @category Engine
     */
    export type IConstantPlayer = IPlayer & IConstantPlayerOptions;

    /**
     * Returns a new instance of {@link Engine.IConstantPlayer}.
     *
     * @category Engine
     *
     * @param options Options to configure {@link Engine.IConstantPlayer}.
     * @returns The configured {@link Engine.IConstantPlayer} instance.
     */
    export function makeConstantPlayer(
        options: IConstantPlayerOptions,
    ): IConstantPlayer;

    // ---------- engine/dummy_player.ts ----------

    /**
     * Represents the options passed to {@link Engine.makeDummyPlayer}.
     *
     * @category Engine
     */
    export type IDummyPlayerOptions = IPlayerOptions;

    /**
     * Represents an AI Player that always throws an error when it is
     * their turn to compute a move.
     *
     * @category Engine
     */
    export type IDummyPlayer = IPlayer;

    /**
     * Returns a new instance of {@link Engine.IDummyPlayer}.
     *
     * @category Engine
     *
     * @param options Options to configure {@link Engine.IDummyPlayer}.
     * @returns The configured {@link Engine.IDummyPlayer} instance.
     */
    export function makeDummyPlayer(
        options: IDummyPlayerOptions,
    ): IDummyPlayer;

    // ---------- engine/forfeit_player.ts ----------

    /**
     * Represents the options passed to {@link Engine.makeForfeitPlayer}.
     *
     * @category Engine
     */
    export type IForfeitPlayerOptions = IPlayerOptions;

    /**
     * Represents an AI Player that always forfeits when it is
     * their turn to compute a move.
     *
     * @category Engine
     */
    export type IForfeitPlayer = IPlayer;

    /**
     * Returns a new instance of {@link Engine.IForfeitPlayer}.
     *
     * @category Engine
     *
     * @param options Options to configure {@link Engine.IForfeitPlayer}.
     * @returns The configured {@link Engine.IForfeitPlayer} instance.
     */
    export function makeForfeitPlayer(
        options: IForfeitPlayerOptions,
    ): IForfeitPlayer;
}

/**
 * Game State Global Singletons
 *
 * @category Game
 */
declare namespace Game {
    // ---------- worker/game_namespace.ts ----------

    /**
     * Represents the {@link Engine.IGameBoard} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     */
    export const board: Engine.IGameBoard;

    /**
     * Represents the {@link Engine.IGameSession} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     */
    export const session: Engine.IGameSession;

    /**
     * Represents the {@link Engine.IPlayer} singleton that the game engine
     * uses to track your AI Player's moves.
     *
     * @category Game
     */
    export const player: Engine.IPlayer;
}

/**
 * Player Scripting Environment Meta Global APIs
 *
 * @category PlayerScript
 */
declare namespace PlayerScript {
    // ---------- worker/player_script.ts ----------

    /**
     * Represents the compute callback returned by custom AI players.
     *
     * @category PlayerScript
     */
    export type IComputePlayerMoveCallback = () =>
        | Promise<Engine.IPlayerMove | null>
        | Engine.IPlayerMove
        | null;
}
