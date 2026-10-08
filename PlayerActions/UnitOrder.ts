// Generic: a standing order for one of a player's units, such as "explore" or "improve the terrain", passed to an
//  `OrderStrategy`'s `order`. A player's automation creates one when it runs the order for a unit. It's never a
//  mandatory action: nothing calls `Player#mandatoryAction()` for it, and the computer players' strategies don't handle
//  it. It's a class of its own, so its ids come from its own counter, apart from every other action's.
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Unit from '@civ-clone/core-unit/Unit';

export class UnitOrder extends PlayerAction<Unit> {
  constructor(player: Player, unit: Unit) {
    super(player, unit);
  }
}

export default UnitOrder;
