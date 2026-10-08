import { findStrategy, isOrderStrategy } from '../Strategies/lib/OrderStrategy';
import AIStrategy from '../Strategies/lib/AIStrategy';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import StrategyRegistry from '@civ-clone/core-strategy/StrategyRegistry';
import UnitOrder from '../PlayerActions/UnitOrder';
import { Warrior } from '@civ-clone/civ1-unit/Units';
import { createDependencies } from '../lib/Dependencies';
import { expect } from 'chai';
import { knowledge } from './lib/testGame';
import testGame from './lib/testGame';

class Ordered extends AIStrategy {
  handles(action: PlayerAction): boolean {
    return false;
  }

  order(action: UnitOrder): boolean {
    return true;
  }
}

class Unordered extends AIStrategy {}

describe('UnitOrder', (): void => {
  it('should carry the player and unit, with ids of its own', async (): Promise<void> => {
    const { addPlayer, addUnit } = await testGame('1G', 1, 1),
      player = addPlayer(),
      unit = addUnit(Warrior, player, 0, 0),
      order = new UnitOrder(player, unit);

    expect(order).instanceOf(PlayerAction);
    expect(order.player()).to.equal(player);
    expect(order.value()).to.equal(unit);
    expect(order.id()).to.match(/^UnitOrder-/);
  });

  it('should find the strategy to run an order with', (): void => {
    const registry = new StrategyRegistry(),
      dependencies = createDependencies(),
      unordered = new Unordered(dependencies, knowledge),
      ordered = new Ordered(dependencies, knowledge);

    registry.register(unordered, ordered);

    expect(findStrategy(registry, Ordered)).to.equal(ordered);
    expect(findStrategy(new StrategyRegistry(), Ordered)).to.equal(null);
    expect(isOrderStrategy(ordered)).true;
    expect(isOrderStrategy(unordered)).false;
  });
});
