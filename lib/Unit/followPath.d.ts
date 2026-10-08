import Action from '@civ-clone/core-unit/Action';
import Dependencies from '../Dependencies';
import Knowledge from '../Knowledge';
import Memory from '../Memory';
import Player from '@civ-clone/core-player/Player';
import Unit from '@civ-clone/core-unit/Unit';
export type FollowPathResult =
  | 'arrived'
  | 'blocked'
  | 'threatened'
  | 'out-of-moves';
export declare const peacefulMoves: (actions: Action[]) => Action[];
export declare const followPath: (
  dependencies: Dependencies,
  player: Player,
  memory: Memory,
  knowledge: Knowledge,
  unit: Unit
) => FollowPathResult;
export default followPath;
