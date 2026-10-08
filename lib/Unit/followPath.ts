// Generic: a peaceful, synchronous mover for a standing order (`UnitOrder`): walks `unit` along the path in its
//  player's memory, a step at a time, while it has moves left. Unlike the computer players' mover it only ever moves:
//  it never attacks, captures, or negotiates with anyone it meets, and it stops as soon as another player's unit is
//  near, to hand the unit back to its player.
import Action from '@civ-clone/core-unit/Action';
import CaptureCity from '@civ-clone/base-unit-action-capture-city/CaptureCity';
import Dependencies from '../Dependencies';
import Knowledge from '../Knowledge';
import Memory from '../Memory';
import Move from '@civ-clone/base-unit-action-move/Move';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import enemyAdjacent from './enemyAdjacent';

// Why `followPath` stopped:
//  - `arrived`: the path has ended, or there was none;
//  - `blocked`: the next step can't be taken (something is in the way, or the unit couldn't get back to safety after
//    it), so the path is forgotten;
//  - `threatened`: another player's unit is near (`enemyAdjacent`), with the rest of the path kept;
//  - `out-of-moves`: the unit has no moves left this turn, with the rest of the path kept.
export type FollowPathResult =
  | 'arrived'
  | 'blocked'
  | 'threatened'
  | 'out-of-moves';

// The moves the unit could make onto `tile`, of `actions`: a plain move first, then any other kind of move (onto a
//  ship, off one, landing), but never capturing a city, which is an attack.
export const peacefulMoves = (actions: Action[]): Action[] => {
  const moves = actions.filter(
    (action: Action): boolean =>
      action instanceof Move && !(action instanceof CaptureCity)
  );

  return [
    ...moves.filter((action: Action): boolean => action.constructor === Move),
    ...moves.filter((action: Action): boolean => action.constructor !== Move),
  ];
};

// How many steps at most in one call, however the rules treat a move: a unit whose moves never run out stops anyway.
const STEP_LIMIT = 1e3;

export const followPath = (
  dependencies: Dependencies,
  player: Player,
  memory: Memory,
  knowledge: Knowledge,
  unit: Unit
): FollowPathResult => {
  for (let steps = 0; steps < STEP_LIMIT; steps++) {
    const path = memory.unitPathData.get(unit);

    if (!path || path.length === 0) {
      memory.unitPathData.delete(unit);

      return 'arrived';
    }

    if (!unit.active() || unit.moves().value() < 0.1) {
      return 'out-of-moves';
    }

    if (enemyAdjacent(dependencies, player, unit)) {
      return 'threatened';
    }

    const next: Tile = path.start(),
      [move] = next.isNeighbourOf(unit.tile())
        ? peacefulMoves(unit.actions(next))
        : [];

    if (!move || !knowledge.canReturnAfter(dependencies, player, unit, move)) {
      memory.unitPathData.delete(unit);

      return 'blocked';
    }

    path.shift();
    unit.action(move);

    const lastMoves = memory.lastUnitMoves.get(unit) || [];

    lastMoves.push(next);
    memory.lastUnitMoves.set(unit, lastMoves.slice(-50));
  }

  return 'out-of-moves';
};

export default followPath;
