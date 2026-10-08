// Generic: a strategy that can also carry out a standing order for one unit (`UnitOrder`), such as a player's
//  automated explorer or worker, using what the computer players use. An order runs synchronously, for the unit's moves
//  this turn, and never attacks or negotiates.
import Strategy from '@civ-clone/core-strategy/Strategy';
import StrategyRegistry from '@civ-clone/core-strategy/StrategyRegistry';
import UnitOrder from '../../PlayerActions/UnitOrder';

export interface OrderStrategy {
  // Carries out the order for the unit's turn. Returns `false` when the order should be handed back to the player:
  //  there's nothing left to do, or an enemy is near. Otherwise `true`: the unit has done what it can this turn.
  order(action: UnitOrder): boolean;
}

export const isOrderStrategy = (
  strategy: Strategy
): strategy is Strategy & OrderStrategy =>
  typeof (strategy as Partial<OrderStrategy>).order === 'function';

// The first strategy in `registry` of type `StrategyType`, such as the game's `Explore`, to run an order with. `null`
//  when none is registered.
export const findStrategy = <T extends Strategy>(
  registry: StrategyRegistry,
  StrategyType: abstract new (...args: any[]) => T
): T | null =>
  (registry
    .entries()
    .find((strategy: Strategy): boolean => strategy instanceof StrategyType) as
    | T
    | undefined) ?? null;

export default OrderStrategy;
