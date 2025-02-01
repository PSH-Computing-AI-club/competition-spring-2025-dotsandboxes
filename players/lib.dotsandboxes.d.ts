/**
 * ## API Reference
 *
 * To begin using this API Reference click on a category of APIs
 * listed on the left sidebar or at the bottom of this page.
 *
 * ## AI Player Scripting Help
 *
 * For general documentation on how to script your AI Player visit
 * the [AI Player Scripting FAQs](https://github.com/PSH-Computing-AI-club/competition-spring-2025/blob/main/ai-player-scripting.md).
 *
 * ## API Categories
 *
 * @showCategories
 *
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

    /**
     * Represents options passed to {@linkcode Engine.InvalidPlacementError}.
     *
     * @category Engine
     */
    export interface InvalidPlacementErrorOptions extends ErrorOptions {
        /**
         * Represents the {@linkcode Engine.IPlayerTurn} instance that
         * triggered the error instance being thrown.
         */
        readonly playerTurn: IPlayerTurn;
    }

    /**
     * Represents options passed to {@linkcode Engine.InvalidQueryError}.
     *
     * @category Engine
     */
    export interface InvalidQueryErrorOptions extends ErrorOptions {
        /**
         * Represents the x-coordinate that triggered the error
         * instance being thrown.
         */
        readonly x: number;

        /**
         * Represents the y-coordinate that trigger the error
         * instance being thrown.
         */
        readonly y: number;
    }

    /**
     * Represents options passed to {@linkcode Engine.PlayerComputeThrowError}.
     *
     * @category Engine
     */
    export interface PlayerComputeThrowErrorOptions extends ErrorOptions {
        /**
         * Represents the error thrown by the {@linkcode Engine.IPlayer}
         * instance.
         */
        readonly error: Error;

        /**
         * Represents the {@linkcode Engine.IPlayer} instance that threw
         * an error during compute.
         */
        readonly player: IPlayer;
    }

    /**
     * Represents options passed to {@linkcode Engine.PlayerForfeitError}.
     *
     * @category Engine
     */
    export interface PlayerForfeitErrorOptions extends ErrorOptions {
        /**
         * Represents the {@linkcode Engine.IPlayer} instance that returned
         * `null` during their move computation.
         */
        readonly player: IPlayer;
    }

    /**
     * Represents options passed to {@linkcode Engine.PlayerTimeoutError}.
     *
     * @category Engine
     */
    export interface PlayerTimeoutErrorOptions extends ErrorOptions {
        /**
         * Represents the {@linkcode Engine.IPlayer} instance that did
         * not compute its move within the {@linkcode Engine.IGameSessionOptions.timeout}
         * configured timelimit.
         */
        readonly player: IPlayer;
    }

    /**
     * Represents when an invalid xy-pair coordinates is used to
     * make a move.
     *
     * @category Engine
     */
    export class InvalidPlacementError extends Error {
        /**
         * Represents the {@linkcode Engine.IPlayerTurn} instance that
         * triggered the error instance being thrown.
         */
        readonly playerTurn: IPlayerTurn;

        /**
         * Constructor for {@linkcode Engine.InvalidPlacementError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.InvalidPlacementError}.
         */
        constructor(message: string, options: InvalidPlacementErrorOptions);
    }

    /**
     * Represents when an invalid xy-pair coordinates is used to
     * query the current game state.
     *
     * @category Engine
     */
    export class InvalidQueryError extends Error {
        /**
         * Represents the x-coordinate that triggered the error
         * instance being thrown.
         */
        readonly x: number;

        /**
         * Represents the y-coordinate that triggered the error
         * instance being thrown.
         */
        readonly y: number;

        /**
         * Constructor for {@linkcode Engine.InvalidQueryError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.InvalidQueryError}.
         */
        constructor(message: string, options: InvalidQueryErrorOptions);
    }

    /**
     * Represents when the game state tries to select the next
     * {@linkcode IPlayer} instance to compute a move and none are
     * found.
     *
     * @category Engine
     */
    export class NoNextPlayerError extends Error {
        /**
         * Constructor for {@linkcode Engine.NoNextPlayerError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.NoNextPlayerError}.
         */
        constructor(message: string, options?: ErrorOptions);
    }

    /**
     * Represents when an {@linkcode Engine.IPlayer} instance that threw
     * an error when its {@linkcode Engine.IPlayer.computePlayerMove} was called.
     *
     * @category Engine
     */
    export class PlayerComputeThrowError extends Error {
        /**
         * Represents the error thrown by the {@linkcode Engine.IPlayer}
         * instance.
         */
        readonly error: Error;

        /**
         * Represents the {@linkcode Engine.IPlayer} instance that threw
         * an error during compute.
         */
        readonly player: IPlayer;

        /**
         * Constructor for {@linkcode Engine.PlayerComputeThrowError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.PlayerComputeThrowError}.
         */
        constructor(
            message: string,
            options: PlayerComputeThrowErrorOptions,
        );
    }

    /**
     * Represents when an {@linkcode Engine.IPlayer} instance that
     * returned a `null` value when its {@linkcode Engine.IPlayer.computePlayerMove}
     * was called.
     *
     * @category Engine
     */
    export class PlayerForfeitError extends Error {
        /**
         * Represents the {@linkcode Engine.IPlayer} instance that returned
         * `null` during their move computation.
         */
        readonly player: IPlayer;

        /**
         * Constructor for {@linkcode Engine.PlayerForfeitError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.PlayerForfeitError}.
         */
        constructor(
            message: string,
            options: PlayerForfeitErrorOptions,
        );
    }

    /**
     * Represents when an {@linkcode Engine.IPlayer} instance that did
     * not compute its move within the {@linkcode Engine.IGameSessionOptions.timeout}
     * configured timelimit when its {@linkcode Engine.IPlayer.computePlayerMove}
     * was called.
     *
     * @category Engine
     */
    export class PlayerTimeoutError extends Error {
        /**
         * Represents the {@linkcode Engine.IPlayer} instance that did
         * not compute its move within the {@linkcode Engine.IGameSessionOptions.timeout}
         * configured timelimit.
         */
        readonly player: IPlayer;

        /**
         * Constructor for {@linkcode Engine.PlayerTimeoutError}.
         *
         * @param message Message the error will print to console.
         * @param options Options to configure {@linkcode Engine.PlayerTimeoutError}.
         */
        constructor(
            message: string,
            options: PlayerTimeoutErrorOptions,
        );
    }

    // ---------- engine/player.ts ----------

    /**
     * Represents options passed to {@linkcode Engine.IPlayerConstructor}.
     *
     * @category Engine
     */
    export interface IPlayerOptions {
        /**
         * Represents the initial character assigned to the
         * {@linkcode IPlayer} instance.
         */
        readonly playerInitial: string;

        /**
         * Represents the seed the {@linkcode Engine.IPlayer} instance
         * should configure their random number generator with.
         */
        readonly seed: number;

        /**
         * Represents a "stringification" function that serializes
         * the {@linkcode Engine.IPlayer} instance into a human-readable string.
         */
        toString(): string;
    }

    /**
     * Represents a common interface for AI Players to implement. This
     * allows the game engine to communicate with AI Players using
     * a strict specification without edge cases.
     *
     * @category Engine
     */
    export interface IPlayer extends IPlayerOptions {
        /**
         * The callback function for AI Players that passes them
         * the current game state so they can return a computed move.
         *
         * @param gameSession
         * @param gameBoard
         * @returns The move that the {@linkcode Engine.IPlayer} instance computed.
         */
        computePlayerMove(
            gameSession: IGameSession,
            gameBoard: IGameBoard,
        ): Promise<IPlayerMove | null>;
    }

    /**
     * Represents a common interface for AI Players to implement. This
     * allows for the game engine to construct AI Players without having
     * to implement edge cases.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IPlayer}.
     * @returns The configured {@linkcode Engine.IPlayer} instance.
     */
    export type IPlayerConstructor<
        Options extends IPlayerOptions = IPlayerOptions,
        Player extends IPlayer = IPlayer,
    > = (
        options: Options,
    ) => Player;

    // ---------- engine/player_move.ts ----------

    /**
     * Represents a move computed by an AI Player.
     *
     * @category Engine
     */
    export interface IPlayerMove {
        /**
         * Represents the x-coordinate the AI Player tried to draw a
         * line at.
         */
        readonly x: number;

        /**
         * Represents the x-coordinate the AI Player tried to draw a
         * line at.
         */
        readonly y: number;
    }

    /**
     * Returns if the supplied xy-pair coordinates is a legal move.
     *
     * > **IMPORTANT**: This function does _NOT_ check if the coordinate
     * > pair already had a line draw at the location.
     *
     * @category Engine
     *
     * @param x The x-coordinate to check.
     * @param y The y-coordinate to check.
     * @returns If the coordinates are a legal move.
     */
    export function isLegalMove(x: number, y: number): boolean;

    /**
     * Returns a new instance of {@linkcode Engine.IPlayerMove}.
     *
     * @category Engine
     *
     * @throws [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
     * if configured {@linkcode Engine.IPlayerMove.x} and {@linkcode Engine.IPlayerMove.y}
     * fields are not of {@linkcode Engine.SLOT_KIND.spacer} kind.
     *
     * @param options Options to configure {@linkcode Engine.IPlayerMove}.
     * @returns The configured {@linkcode Engine.IPlayerMove} instance.
     */
    export function makePlayerMove(options: IPlayerMove): IPlayerMove;

    // ---------- engine/player_turn.ts ----------

    /**
     * Represents a turn taken by an AI Player that was committed to
     * the game state.
     *
     * @category Engine
     */
    export interface IPlayerTurn extends IPlayerMove {
        /**
         * Represents the {@linkcode Engine.IPlayer} instance who
         * took the committed turn.
         */
        readonly player: IPlayer;

        /**
         * Represents the turn number of when this turn was committed.
         *
         * > **NOTE**: This number is zero-indexed!
         */
        readonly turnIndex: number;
    }

    /**
     * Returns a new {@linkcode Engine.IPlayerTurn} instance.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IPlayerTurn}.
     * @returns The configured {@linkcode Engine.IPlayerTurn} instance.
     */
    export function makePlayerTurn(options: IPlayerTurn): IPlayerTurn;

    /**
     * Returns a new {@linkcode Engine.IPlayerTurn} instance that was
     * partially configured via an {@linkcode Engine.IPlayerMove} instance.
     *
     * @category Engine
     *
     * @param moveOptions {@linkcode Engine.IPlayerMove} instance to pull data from.
     * @param turnOptions Abbreviated options to configure {@linkcode Engine.IPlayerTurn}.
     * @returns The configured {@linkcode Engine.IPlayerTurn} instance.
     */
    export function makePlayerTurnFromPlayerMove(
        moveOptions: IPlayerMove,
        turnOptions: Omit<IPlayerTurn, keyof IPlayerMove>,
    ): IPlayerTurn;

    // ---------- engine/game_board_slot.ts ----------

    /**
     * Represents an enumeration of all possible types of game board grid
     * slots that can be stored in {@linkcode Engine.IGameBoard.grid}.
     *
     * @enum
     * @category Engine
     */
    export const SLOT_KIND: {
        /**
         * Represents that the game board grid slot is a dot boundary.
         *
         * > **NOTE**: Lines cannot be placed by AI Players on this
         * > slot kind.
         *
         * > **NOTE**: All game board grid slots of
         * > {@linkcode Engine.SLOT_KIND.dot} kind have coordinates
         * > following the `(even, even)` xy-pair pattern.
         */
        readonly dot: 'SLOT_DOT';

        /**
         * Represents that the game board grid slot is an empty box
         * that does not yet have an initial inside of it.
         *
         * > **NOTE**: Lines cannot be placed by AI Players on this
         * > slot kind.
         *
         * > **NOTE**: All game board grid slots of
         * > {@linkcode Engine.SLOT_KIND.box} kind have coordinates
         * > following the `(odd, odd)` xy-pair pattern.
         */
        readonly box: 'SLOT_BOX';

        /**
         * Represents that the game board grid slot is a box that
         * has an initial inside of it. Thus, the box is captured.
         *
         * > **NOTE**: Lines cannot be placed by AI Players on this
         * > slot kind.
         *
         * > **NOTE**: All game board grid slots of
         * > {@linkcode Engine.SLOT_KIND.initial} kind have coordinates
         * > following the `(odd, odd)` xy-pair pattern.
         */
        readonly initial: 'SLOT_INITIAL';

        /**
         * Represents that the game board grid slot is an empty
         * spacer between dot boundary slots.
         *
         * > **NOTE**: All game board grid slots of
         * > {@linkcode Engine.SLOT_KIND.spacer} kind have coordinates
         * > following the `(even, odd)` or `(odd, even)` xy-pair patterns.
         */
        readonly spacer: 'SLOT_SPACER';

        /**
         * Represents that the game board grid slot is a spacer
         * between dot boundary slots that has line drawn on it.
         *
         * > **NOTE**: Lines cannot be placed by AI Players on this
         * > slot kind.
         *
         * > **NOTE**: All game board grid slots of
         * > {@linkcode Engine.SLOT_KIND.spacer} kind have coordinates
         * > following the `(even, odd)` or `(odd, even)` xy-pair patterns.
         */
        readonly line: 'SLOT_LINE';
    };

    /**
     * Represents a string union of all possible win kind identifiers
     * there are.
     *
     * @category Engine
     */
    export type SlotKind =
        | 'SLOT_DOT'
        | 'SLOT_BOX'
        | 'SLOT_INITIAL'
        | 'SLOT_SPACER'
        | 'SLOT_LINE';

    /**
     * Represents options passed to {@linkcode Engine.makeGameBoardSlot}.
     *
     * @category Engine
     */
    export interface IGameBoardSlotOptions {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is only filled when a line has been placed
         * > on a spacer slot or a box has been captured.
         */
        readonly playerTurn?: IPlayerTurn | null;

        /**
         * Represents the x-coordinate of where the game board grid slot
         * is located at in {@linkcode Engine.IGameBoard.grid}.
         */
        readonly x: number;

        /**
         * Represents the y-coordinate of where the game board grid slot
         * is located at in {@linkcode Engine.IGameBoard.grid}.
         */
        readonly y: number;
    }

    /**
     * Represents the common interface to all game board grid slot kinds.
     *
     * @category Engine
     */
    export interface IBaseBoardSlot extends Required<IGameBoardSlotOptions> {
        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This value is computed by {@linkcode Engine.makeGameBoardSlot}
         * > based on the xy-pair coordinates.
         */
        readonly slotKind: SlotKind;

        /**
         * Returns if the game board grid slot is a horizontal spacer.
         *
         * > **NOTE**: This function only checks the coordinate pair. It
         * > does not check if `{@link IBaseBoardSlot.slotKind} === {@link SLOT_KIND.spacer}`.
         *
         * @returns If the game board grid slot is horizontal.
         */
        isHorizontalSpacer(): boolean;

        /**
         * Returns if the game board grid slot is a vertical spacer.
         *
         * > **NOTE**: This function only checks the coordinate pair. It
         * > does not check if `{@link IBaseBoardSlot.slotKind} === {@link SLOT_KIND.spacer}`.
         *
         * @returns if the game board grid slot is vertical.
         */
        isVerticalSpacer(): boolean;
    }

    /**
     * Represents a game board grid slot instance whose {@linkcode IBoxBoardSlot.slotKind}
     * field is always set to {@linkcode SLOT_KIND.box} and never
     * has an associated {@linkcode Engine.IPlayerTurn} assigned to it.
     *
     * @category Engine
     */
    export interface IBoxBoardSlot extends IBaseBoardSlot {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is always `null` for this game board
         * > grid slot kind.
         */
        readonly playerTurn: null;

        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This field is always {@linkcode SLOT_KIND.box}
         * > for this game board grid slot kind.
         */
        readonly slotKind: typeof SLOT_KIND['box'];

        /**
         * Returns `" "` to represent an empty box.
         */
        toString(): ' ';
    }

    /**
     * Represents a game board grid slot instance whose {@linkcode IDotBoardSlot.slotKind}
     * field is always set to {@linkcode SLOT_KIND.dot} and never
     * has an associated {@linkcode Engine.IPlayerTurn} assigned to it.
     *
     * @category Engine
     */
    export interface IDotBoardSlot extends IBaseBoardSlot {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is always `null` for this game board
         * > grid slot kind.
         */
        readonly playerTurn: null;

        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This field is always {@linkcode SLOT_KIND.dot}
         * > for this game board grid slot kind.
         */
        readonly slotKind: typeof SLOT_KIND['dot'];

        /**
         * Returns `"."` to represent a dot boundary.
         */
        toString(): '.';
    }

    /**
     * Represents a game board grid slot instance whose {@linkcode IInitialBoardSlot.slotKind}
     * field is always set to {@linkcode SLOT_KIND.initial} and always
     * has an associated {@linkcode Engine.IPlayerTurn} assigned to it.
     *
     * @category Engine
     */
    export interface IInitialBoardSlot extends IBaseBoardSlot {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is always valid for this game board
         * > grid slot kind.
         */
        readonly playerTurn: IPlayerTurn;

        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This field is always {@linkcode SLOT_KIND.initial}
         * > for this game board grid slot kind.
         */
        readonly slotKind: typeof SLOT_KIND['initial'];

        /**
         * Returns the initial of the player who captured the box.
         */
        toString(): string;
    }

    /**
     * Represents a game board grid slot instance whose {@linkcode ILineBoardSlot.slotKind}
     * field is always set to {@linkcode SLOT_KIND.line} and always
     * has an associated {@linkcode Engine.IPlayerTurn} assigned to it.
     *
     * @category Engine
     */
    export interface ILineBoardSlot extends IBaseBoardSlot {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is always valid for this game board
         * > grid slot kind.
         */
        readonly playerTurn: IPlayerTurn;

        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This field is always {@linkcode SLOT_KIND.line}
         * > for this game board grid slot kind.
         */
        readonly slotKind: typeof SLOT_KIND['line'];

        /**
         * Returns `"-"` or `"|"` depending on if line is horizontal
         * or vertical.
         */
        toString(): '-' | '|';
    }

    /**
     * Represents a game board grid slot instance whose {@linkcode ISpacerBoardSlot.slotKind}
     * field is always set to {@linkcode SLOT_KIND.spacer} and never
     * has an associated {@linkcode Engine.IPlayerTurn} assigned to it.
     *
     * @category Engine
     */
    export interface ISpacerBoardSlot extends IBaseBoardSlot {
        /**
         * Represents an {@linkcode Engine.IPlayerTurn} instance associated
         * with the game board grid slot.
         *
         * > **NOTE**: This field is always `null` for this game board
         * > grid slot kind.
         */
        readonly playerTurn: null;

        /**
         * Represents what kind the game board grid slot is.
         *
         * > **NOTE**: This field is always {@linkcode SLOT_KIND.spacer}
         * > for this game board grid slot kind.
         */
        readonly slotKind: typeof SLOT_KIND['spacer'];

        /**
         * Returns `" "` to represent an empty spacer.
         */
        toString(): ' ';
    }

    /**
     * Represents a game board grid slot instance that could be a
     * captured or empty box.
     *
     * > **NOTE**: This is used in APIs like {@linkcode Engine.IGameBoard.walkBoxes}
     * > which can return either kind.
     *
     * @category Engine
     */
    export type IBoxLikeBoardSlot = IBoxBoardSlot | IInitialBoardSlot;

    /**
     * Represents a game board grid slot instance that could be a
     * drawn line or empty spacer.
     *
     * > **NOTE**: This is used in APIs like {@linkcode Engine.IGameBoard.walkSpacers}
     * > which can return either kind.
     *
     * @category Engine
     */
    export type ISpacerLikeBoardSlot = ILineBoardSlot | ISpacerBoardSlot;

    /**
     * Represents all possible game board grid slot instances.
     *
     * > **NOTE**: This is used in APIs like {@linkcode Engine.IGameBoard.grid}
     * > which can return any kind.
     *
     * @category Engine
     */
    export type IGameBoardSlot =
        | IBoxBoardSlot
        | IDotBoardSlot
        | IInitialBoardSlot
        | ILineBoardSlot
        | ISpacerBoardSlot;

    /**
     * Returns the associated {@linkcode Engine.SLOT_KIND} kind matching
     * the following xy-pair coordinates criteria:
     *
     * - (even, even) — {@linkcode Engine.SLOT_KIND.dot}
     * - (odd, odd) — {@linkcode Engine.SLOT_KIND.box}
     * - (odd, even) — {@linkcode Engine.SLOT_KIND.spacer}
     * - (even, odd) — {@linkcode Engine.SLOT_KIND.spacer}
     *
     * > **NOTE**: Use this function to compute a {@linkcode Engine.SLOT_KIND}
     * > as if there were no {@linkcode Engine.IPlayerTurn} instance
     * > associated with the coordinates.
     *
     * @category Engine
     *
     * @param x The x-coordinate to compute from.
     * @param y The y-coordinate to compute from.
     * @returns The associated {@linkcode Engine.SLOT_KIND}.
     */
    export function determineInitialSlotKind(x: number, y: number): SlotKind;

    /**
     * Returns the associated {@linkcode Engine.SLOT_KIND} kind matching
     * the following xy-pair coordinates criteria:
     *
     * - (even, even) — {@linkcode Engine.SLOT_KIND.dot}
     * - (odd, odd) — {@linkcode Engine.SLOT_KIND.initial}
     * - (odd, even) — {@linkcode Engine.SLOT_KIND.line}
     * - (even, odd) — {@linkcode Engine.SLOT_KIND.line}
     *
     * > **NOTE**: Use this function to compute a {@linkcode Engine.SLOT_KIND}
     * > as if there was a {@linkcode Engine.IPlayerTurn} instance
     * > associated with the coordinates.
     *
     * @category Engine
     *
     * @param x The x-coordinate to compute from.
     * @param y The y-coordinate to compute from.
     * @returns The associated {@linkcode Engine.SLOT_KIND}.
     */
    export function determinePlacedSlotKind(x: number, y: number): SlotKind;

    /**
     * Returns if a xy-pair coordinates are a horizontal spacer.
     *
     * > **NOTE**: This function only checks the coordinate pair. It
     * > does not check {@linkcode SLOT_KIND}.
     *
     * @category Engine
     *
     * @param x The x-coordinate to check.
     * @param y The y-coordinate to check.
     * @returns If the coordinate pair are horizontal.
     */
    export function isHorizontalSpacer(x: number, y: number): boolean;

    /**
     * Returns if a xy-pair coordinates are a vertical spacer.
     *
     * > **NOTE**: This function only checks the coordinate pair. It
     * > does not check {@linkcode SLOT_KIND}.
     *
     * @category Engine
     *
     * @param x The x-coordinate to check.
     * @param y The y-coordinate to check.
     * @returns If the coordinate pair are vertical.
     */
    export function isVerticalSpacer(x: number, y: number): boolean;

    /**
     * Returns a new {@linkcode Engine.IGameBoardSlot} instance.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IGameBoardSlot}.
     * @returns The configured {@linkcode Engine.IGameBoardSlot} instance.
     */
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
     * Returns a new {@linkcode Engine.IGameSession} instance.
     *
     * @category Engine
     *
     * @param options Options to {@linkcode Engine.IGameSession}.
     * @returns The configured {@linkcode Engine.IGameSession} instance.
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
     * Represents options passed to {@linkcode Engine.makeGameResult}.
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
         * Represents the highest score found in {@linkcode Engine.IGameResultOptions.scores}.
         */
        readonly highestScore: number;

        /**
         * Represents what kind of win condition that was computed
         * from the scores found in {@linkcode Engine.IGameResultOptions.scores}.
         */
        readonly winKind: WinKind;

        /**
         * Represents a set containing the players who has the
         * highest scores found in {@linkcode Engine.IGameResultOptions.scores}.
         */
        readonly winningPlayers: ReadonlySet<IPlayer>;
    }

    /**
     * Returns a new instance of {@linkcode Engine.IGameResult}.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IGameResult}.
     * @returns The configured {@linkcode Engine.IGameResult} instance.
     */
    export function makeGameResult(options: IGameResultOptions): IGameResult;

    /**
     * Returns a computed scoring result of a Dots and Boxes given any game
     * session and game board.
     *
     * @category Engine
     *
     * @param gameSession {@linkcode Engine.IGameSession} instance to pull data from.
     * @param gameBoard {@linkcode Engine.IGameBoard} instance to pull data from.
     * @returns The configured {@linkcode Engine.IGameResult} instance.
     */
    export function computeGameResultFromGame(
        gameSession: IGameSession,
        gameBoard: IGameBoard,
    ): IGameResult;

    // ---------- engine/constant_player.ts ----------

    /**
     * Represents the options passed to {@linkcode Engine.makeConstantPlayer}.
     *
     * @category Engine
     */
    export interface IConstantPlayerOptions extends IPlayerOptions {
        /**
         * Represents the x-coordinate that the {@linkcode Engine.IConstantPlayer}
         * instance will always compute.
         */
        readonly x: number;

        /**
         * Represents the y-coordinate that the {@linkcode Engine.IConstantPlayer}
         * instance will always compute.
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
     * Returns a new instance of {@linkcode Engine.IConstantPlayer}.
     *
     * > **NOTE**: This function implements {@linkcode Engine.IPlayerConstructor}.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IConstantPlayer}.
     * @returns The configured {@linkcode Engine.IConstantPlayer} instance.
     */
    export function makeConstantPlayer(
        options: IConstantPlayerOptions,
    ): IConstantPlayer;

    // ---------- engine/dummy_player.ts ----------

    /**
     * Represents the options passed to {@linkcode Engine.makeDummyPlayer}.
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
     * Returns a new instance of {@linkcode Engine.IDummyPlayer}.
     *
     * > **NOTE**: This function implements {@linkcode Engine.IPlayerConstructor}.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IDummyPlayer}.
     * @returns The configured {@linkcode Engine.IDummyPlayer} instance.
     */
    export function makeDummyPlayer(
        options: IDummyPlayerOptions,
    ): IDummyPlayer;

    // ---------- engine/forfeit_player.ts ----------

    /**
     * Represents the options passed to {@linkcode Engine.makeForfeitPlayer}.
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
     * Returns a new instance of {@linkcode Engine.IForfeitPlayer}.
     *
     * > **NOTE**: This function implements {@linkcode Engine.IPlayerConstructor}.
     *
     * @category Engine
     *
     * @param options Options to configure {@linkcode Engine.IForfeitPlayer}.
     * @returns The configured {@linkcode Engine.IForfeitPlayer} instance.
     */
    export function makeForfeitPlayer(
        options: IForfeitPlayerOptions,
    ): IForfeitPlayer;
}

/**
 * Game State Global Singletons
 *
 * @category Game
 *
 * @example
 *
 * ```javascript
 * const board = Game.board;
 *
 * ... do something w/ board singleton ...
 * ```
 */
declare namespace Game {
    // ---------- worker/game_namespace.ts ----------

    /**
     * Represents the {@linkcode Engine.IGameBoard} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     *
     * @example
     *
     * ```javascript
     * // Cache the singleton for future usage below.
     * const grid = Game.board.grid;
     *
     * export default () => {
     *     // Create a move using the state of the grid.
     *     const move = ... calculate move w/ grid ...;
     *
     *     // Return the xy-pair coordinates of the calculated move.
     *     return {
     *         x: move.x,
     *         y: move.y
     *     };
     * };
     * ```
     */
    export const board: Engine.IGameBoard;

    /**
     * Represents the {@linkcode Engine.IGameSession} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     *
     * @example
     *
     * ```javascript
     * // Cache the singletons for future usage below.
     * const me = Game.player;
     * const turns = Game.session.playerTurns;
     *
     * export default () => {
     *     // Predefine a move variable we will assign below.
     *     let move;
     *
     *     if (turns.length === 0) {
     *         // No opening moves have been made yet, so let's use a
     *         // specific strategy for that case.
     *         move = ...compute a move...;
     *     } else if (turns[0].player === me) {
     *         // An opening move was made and our player made it. So,
     *         // let's use different strategy.
     *         move = ...compute a move...;
     *     } else {
     *         // An opening move was made but our player _did not_
     *         // make it. So, again, let's use another strategy.
     *         move = ...compute a move...;
     *     }
     *
     *     // Return the xy-pair coordinates of the calculated move.
     *     return {
     *         x: move.x,
     *         y: move.y
     *     };
     * };
     * ```
     */
    export const session: Engine.IGameSession;

    /**
     * Represents the {@linkcode Engine.IPlayer} singleton that the game engine
     * uses to track your AI Player's moves.
     *
     * @category Game
     *
     * @example
     *
     * ```javascript
     * // Cache the engine APIs for future usage below.
     * const SLOT_KIND = Engine.SLOT_KIND;
     *
     * // Cache the singletons for future usage below.
     * const board = Game.board;
     * const me = Game.player;
     *
     * export default () => {
     *     // Define some variables to track scores.
     *     let myScore = 0;
     *     let opponentScore = 0;
     *
     *     // `IGameBoard.walkBoxes` uses an optimized traversal algorithm. So,
     *     // let's use that method instead looping `IGameBoard.grid` w/ for-loops.
     *     for (const box of board.walkBoxes()) {
     *         // We only want boxes that have already been captured.
     *         if (box.slotKind === SLOT_KIND.box) {
     *             continue;
     *         }
     *
     *         // If the `IPlayerTurn` instance associated with the box game
     *         // board grid slot matches out player, then we will increment
     *         // our tracked score.
     *         //
     *         // Otherwise, that means an opponent(s) scored points.
     *         if (box.playerTurn.player === me) {
     *             myScore = myScore + 1;
     *         } else {
     *             opponentScore = opponentScore + 1;
     *         }
     *     }
     *
     *     // Predefine a move variable we will assign below.
     *     let move;
     *
     *     // We might use different strategies depending on if the
     *     // opponent(s) are ahead in the match.
     *     if (myScore < opponentScore) {
     *         move = ...compute a move...;
     *     } else {
     *         move = ...compute a move;
     *     }
     *
     *     // Return the xy-pair coordinates of the calculated move.
     *     return {
     *         x: move.x,
     *         y: move.y
     *     };
     * };
     * ```
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
