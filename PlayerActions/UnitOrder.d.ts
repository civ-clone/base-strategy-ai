import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import Unit from '@civ-clone/core-unit/Unit';
export declare class UnitOrder extends PlayerAction<Unit> {
  constructor(player: Player, unit: Unit);
}
export default UnitOrder;
