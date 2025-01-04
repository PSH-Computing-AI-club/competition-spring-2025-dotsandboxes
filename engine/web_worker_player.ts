import type { Remote } from '@workers/caplink';
import { wrap } from '@workers/caplink';

import type { IEventSubscription } from '../util/mod.ts';
import type { IWorkerAPI } from '../worker/mod.ts';

import type { IGameBoard } from './game_board.ts';
import type { IGameSession, ITurnMoveEvent } from './game_session.ts';
import type { IPlayer, IPlayerConstructor, IPlayerOptions } from './player.ts';

const { AlreadyExists, BadResource } = Deno.errors;

export interface IWebWorkerPlayerOptions extends IPlayerOptions {
    readonly gameBoard: IGameBoard;

    readonly gameSession: IGameSession;
}

export type IWebWorkerPlayer = IPlayer & IWebWorkerPlayerOptions;

export const makeWebWorkerPlayer =
    ((options: IWebWorkerPlayerOptions): IWebWorkerPlayer => {
        const { gameBoard, gameSession, playerInitial, seed } = options;

        let remote: Remote<IWorkerAPI> | null = null;
        let turnMoveSubscription: IEventSubscription<ITurnMoveEvent> | null =
            null;
        let worker: Worker | null = null;

        function onTurnMove(event: ITurnMoveEvent): void {
            if (!remote) {
                throw new BadResource(
                    "bad dispatch to 'onTurnMove' (worker RPC wrapper was not previously initialized)",
                );
            }

            const { player, playerMove, turnIndex } = event;
            const { playerInitial } = player;

            remote.onTurnMove({
                playerInitial,
                playerMove,
                turnIndex,
            });
        }

        return {
            gameBoard,
            gameSession,
            playerInitial,
            seed,

            async destroy() {
                if (!worker) {
                    throw new BadResource(
                        "bad dispatch to 'IWebWorkerPlayer.destroy' (worker was not previously initialized)",
                    );
                }

                turnMoveSubscription!.destroy();
                await remote!.destroy();
                worker.terminate();

                remote = null;
                turnMoveSubscription = null;
                worker = null;
            },

            async initialize() {
                if (worker) {
                    throw new AlreadyExists(
                        "bad dispatch to 'IWebWorkerPlayer.initialize' (worker was already initialized)",
                    );
                }

                const { columns, rows } = gameBoard;
                const playerInitials = gameSession.players.map((player) =>
                    player.playerInitial
                );

                worker = new Worker(
                    new URL(import.meta.resolve('../worker/worker.ts')).href,
                    {
                        type: 'module',
                        // @ts-expect-error - **HACK:** Deno currently does not
                        // have this feature typed.
                        //
                        // **IMPORTANT:** We need to give no permissions to the WebWorker!
                        // Otherwise, if the code supplied by participants in the
                        // competition can break V8 / Deno to perform ACE, then they
                        // could wreak havoc on our infrastructure.
                        deno: 'none',
                    },
                );

                remote = wrap<IWorkerAPI>(worker);

                await remote.initialize({
                    columns,
                    playerInitial,
                    playerInitials,
                    seed,
                    rows,
                });

                turnMoveSubscription = gameSession.EVENT_TURN_MOVE.subscribe(
                    onTurnMove,
                );
            },

            computePlayerMove() {
                return remote!.computePlayerMove();
            },
        };
    }) satisfies IPlayerConstructor<IWebWorkerPlayerOptions>;
