// Generic: the ruleset-specific judgements the generic modules defer to. `simple-ai-client`'s
//  `Civ1/knowledge` supplies Civ1's.
import Action from '@civ-clone/core-unit/Action';
import City from '@civ-clone/core-city/City';
import Dependencies from './Dependencies';
import Player from '@civ-clone/core-player/Player';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';

// The ruleset's part of martial law, units in a city keeping its unhappy citizens content (civ-clone/web-renderer#216).
//  `simple-ai-client`'s `Civ1/martialLaw` has Civ1's.
export interface MartialLawPolicy {
  // How many units in `city` martial law can use at most under its player's government: 0 where there's none.
  limit(dependencies: Dependencies, city: City): number;
  // Whether martial law would use a unit of `UnitType`.
  wouldUse(dependencies: Dependencies, UnitType: object): boolean;
}

// Stateless, so one value serves every player.
export interface Knowledge {
  // Whether `unit` can still get back to somewhere it can safely end its turn after taking `action`. In Civ1, only
  //  aircraft (to a city or carrier) and Triremes (to the coast) might not.
  canReturnAfter(
    dependencies: Dependencies,
    player: Player,
    unit: Unit,
    action: Action
  ): boolean;
  // Arranges which tiles `city`'s citizens work.
  assignWorkers(dependencies: Dependencies, city: City): void;
  // How many defenders `city` builds or buys up to (civ-clone/web-renderer#423). Civ1 wants more where a rival's unit
  //  is close.
  defendersWanted(dependencies: Dependencies, city: City): number;
  // How many defenders `city` keeps fortified, and calls idle ones in to, at least as many as it builds. Civ1 keeps
  //  more in the capital and where a rival's unit is close.
  defendersKept(dependencies: Dependencies, city: City): number;
  // Whether `unit` is an aircraft, and so has to end its turns in a city or on a carrier.
  isAircraft(dependencies: Dependencies, unit: Unit): boolean;
  // How many units in a city martial law can use, and so how many the city wants in it.
  martialLaw: MartialLawPolicy;
  shouldBuildCity(
    dependencies: Dependencies,
    player: Player,
    tile: Tile
  ): boolean;
  shouldIrrigate(
    dependencies: Dependencies,
    player: Player,
    tile: Tile
  ): boolean;
  shouldMine(dependencies: Dependencies, player: Player, tile: Tile): boolean;
  shouldRoad(dependencies: Dependencies, player: Player, tile: Tile): boolean;
  // The shields one more unit would cost `city` to support (civ-clone/web-renderer#229), of type `UnitType` if given.
  unitSupport(
    dependencies: Dependencies,
    city: City,
    UnitType?: typeof Unit | null
  ): number;
}

export default Knowledge;
