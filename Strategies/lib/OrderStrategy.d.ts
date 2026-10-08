import Strategy from '@civ-clone/core-strategy/Strategy';
import StrategyRegistry from '@civ-clone/core-strategy/StrategyRegistry';
import UnitOrder from '../../PlayerActions/UnitOrder';
export interface OrderStrategy {
  order(action: UnitOrder): boolean;
}
export declare const isOrderStrategy: (
  strategy: Strategy
) => strategy is Strategy & OrderStrategy;
export declare const findStrategy: <T extends Strategy>(
  registry: StrategyRegistry,
  StrategyType: abstract new (...args: any[]) => T
) => T | null;
export default OrderStrategy;
