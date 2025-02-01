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
     * Represents when an invalid x-y coordinate pair is used to
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
     * Represents when an invalid x-y coordinate pair is used to
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
     * an error when its {@linkcode Engine.IPlayer.computeMove} was called.
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
     * returned a `null` value when its {@linkcode Engine.IPlayer.computeMove}
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
     * configured timelimit when its {@linkcode Engine.IPlayer.computeMove}
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
     * @returns The configured {@linkcode Engine.IPlayer}.
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
     * Returns if the supplied x-y coordinate pair is a legal move.
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
     * @returns The configured {@linkcode Engine.IPlayerMove}.
     */
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
 */
declare namespace Game {
    // ---------- worker/game_namespace.ts ----------

    /**
     * Represents the {@linkcode Engine.IGameBoard} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     */
    export const board: Engine.IGameBoard;

    /**
     * Represents the {@linkcode Engine.IGameSession} singleton that
     * is reflective of the current game state.
     *
     * @category Game
     */
    export const session: Engine.IGameSession;

    /**
     * Represents the {@linkcode Engine.IPlayer} singleton that the game engine
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
