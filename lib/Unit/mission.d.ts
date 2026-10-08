import Dependencies from '../Dependencies';
import Memory from '../Memory';
import Tile from '@civ-clone/core-world/Tile';
import Unit from '@civ-clone/core-unit/Unit';
export type Mission = (
  dependencies: Dependencies,
  memory: Memory,
  unit: Unit
) => boolean;
export declare const nearest: (unit: Unit) => (a: Tile, b: Tile) => number;
export declare const pursue: (
  dependencies: Dependencies,
  memory: Memory,
  unit: Unit,
  list: Tile[],
  ranked: Tile[]
) => boolean;
export default pursue;
