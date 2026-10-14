// Generic: a mission, a kind of target a unit may set off for, and how a unit sets off for the nearest it can reach.
import Dependencies from '../Dependencies';
import Memory from '../Memory';
import Path from '@civ-clone/core-world-path/Path';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
import reachableTiles from './reachable';

// Returns whether `unit` took the mission: it qualifies and has a path to one of the mission's targets, the nearest
//  it can reach. Otherwise the next mission is tried.
export type Mission = (
  dependencies: Dependencies,
  memory: Memory,
  unit: Unit
) => boolean;

export const nearest =
  (unit: Unit) =>
  (a: Tile, b: Tile): number =>
    a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile());

// Sets `unit` off for the first target in `ranked` it has a path to, and takes that target off `list`. Returns whether
//  there was one. `ranked` is sometimes `list` itself, sorted in place, and sometimes a sorted copy of part of it.
export const pursue = (
  dependencies: Dependencies,
  memory: Memory,
  unit: Unit,
  list: Tile[],
  ranked: Tile[]
): boolean => {
  // Only worked out if there's a target to check.
  let reachable: Set<Tile> | null | undefined;

  for (const targetTile of ranked) {
    // Already there: a search would find nothing worth following.
    if (targetTile === unit.tile()) {
      continue;
    }

    if (reachable === undefined) {
      reachable = reachableTiles(unit, dependencies.turn.value());
    }

    // Out of reach: a search would cover everywhere the unit can go and find nothing.
    if (reachable !== null && !reachable.has(targetTile)) {
      continue;
    }

    const path = Path.for(
      unit,
      unit.tile(),
      targetTile,
      dependencies.pathFinderRegistry
    );

    if (path) {
      list.splice(list.indexOf(targetTile), 1);
      memory.unitPathData.set(unit, path);

      return true;
    }
  }

  return false;
};

export default pursue;
