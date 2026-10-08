// Generic: whether another player's unit is near `unit`: on any tile it can see from where it stands. The same test
//  that wakes a sleeping unit (`base-unit-action-sleep`'s `Sleeping`), so a standing order hands a unit back to its
//  player when the unit would have woken.
import Dependencies from '../Dependencies';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

export const enemyAdjacent = (
  dependencies: Dependencies,
  player: Player,
  unit: Unit
): boolean =>
  unit
    .tile()
    .getSurroundingArea(unit.visibility().value())
    .some((tile: Tile): boolean =>
      dependencies.unitRegistry
        .getByTile(tile)
        .some((other: Unit): boolean => other.player() !== player)
    );

export default enemyAdjacent;
