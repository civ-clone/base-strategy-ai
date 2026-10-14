// Generic: the tiles a unit could reach from where it stands, moving the way `simple-world-path`'s `BasePathFinder`
//  does: a land unit by land, a ship by sea. `null` for any other unit, which could go anywhere.
import Land from '@civ-clone/base-unit-type-land/Land';
import Naval from '@civ-clone/base-unit-type-naval/Naval';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

// Whether `unit` can move onto a tile, by its terrain alone: land for a land unit, water for a ship. `null` for any
//  other unit, which can move onto any tile.
export const terrainFor = (unit: Unit): ((tile: Tile) => boolean) | null =>
  unit instanceof Land
    ? (tile: Tile): boolean => tile.isLand()
    : unit instanceof Naval
    ? (tile: Tile): boolean => tile.isWater()
    : null;

// The continents and seas found so far in a turn, by kind and by each of their tiles.
type Kind = 'land' | 'sea';

let found: {
  turn: number;
  byKind: Record<Kind, WeakMap<Tile, Set<Tile>>>;
} | null = null;

const kindsFor = (turn: number): Record<Kind, WeakMap<Tile, Set<Tile>>> => {
  if (found === null || found.turn !== turn) {
    found = { turn, byKind: { land: new WeakMap(), sea: new WeakMap() } };
  }

  return found.byKind;
};

// One pass over the unit's continent or sea. Checking targets against it saves a path search over the whole of it for
//  each target the unit can't reach, such as the coast of another continent that a ship has seen.
//
// Given the `turn`, each continent and sea is crossed once that turn and the set shared by every unit on it, so not for
//  changing: every unit given a mission asked for its own, for each mission it was offered, and most of a player's
//  units share a few continents (civ-clone/web-renderer#316). No rule turns land into sea or sea into land, but what's
//  found is only kept for the turn all the same. From a tile the unit couldn't move on to, such as a land unit aboard a
//  ship, what it reaches is the land all around, which isn't one continent, so it's found afresh.
export const reachableTiles = (unit: Unit, turn?: number): Set<Tile> | null => {
  const canEnter = terrainFor(unit);

  if (canEnter === null) {
    return null;
  }

  const start = unit.tile(),
    byKind =
      turn !== undefined && canEnter(start)
        ? kindsFor(turn)[unit instanceof Land ? 'land' : 'sea']
        : null,
    known = byKind?.get(start);

  if (known) {
    return known;
  }

  const reached = new Set<Tile>([start]),
    queue: Tile[] = [start];

  for (let i = 0; i < queue.length; i++) {
    queue[i].getNeighbours().forEach((tile: Tile): void => {
      if (!reached.has(tile) && canEnter(tile)) {
        reached.add(tile);
        queue.push(tile);
      }
    });
  }

  if (byKind) {
    reached.forEach((tile: Tile): void => {
      byKind.set(tile, reached);
    });
  }

  return reached;
};

export default reachableTiles;
