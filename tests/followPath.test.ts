import { Horseman, Warrior } from '@civ-clone/civ1-unit/Units';
import testGame, { knowledge } from './lib/testGame';
import Path from '@civ-clone/core-world-path/Path';
import Tile from '@civ-clone/core-world/Tile';
import { createMemory } from '../lib/Memory';
import enemyAdjacent from '../lib/Unit/enemyAdjacent';
import { expect } from 'chai';
import followPath from '../lib/Unit/followPath';

const pathOf = (...tiles: Tile[]): Path => new Path(...tiles);

describe('enemyAdjacent', (): void => {
  it('should only see another player’s units beside the unit', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies } = await testGame('25G', 5, 5),
      player = addPlayer(),
      other = addPlayer(),
      unit = addUnit(Warrior, player, 2, 2);

    expect(enemyAdjacent(dependencies, player, unit)).false;

    addUnit(Warrior, player, 2, 3);

    expect(enemyAdjacent(dependencies, player, unit)).false;

    addUnit(Warrior, other, 4, 4);

    expect(enemyAdjacent(dependencies, player, unit)).false;

    addUnit(Warrior, other, 3, 3);

    expect(enemyAdjacent(dependencies, player, unit)).true;
  });
});

describe('followPath', (): void => {
  it('should walk the path and report arriving', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await testGame(
        '25G',
        5,
        5
      ),
      player = addPlayer(),
      unit = addUnit(Horseman, player, 0, 0),
      memory = createMemory();

    memory.unitPathData.set(unit, pathOf(world.get(1, 0), world.get(2, 0)));

    expect(followPath(dependencies, player, memory, knowledge, unit)).to.equal(
      'arrived'
    );
    expect(unit.tile()).to.equal(world.get(2, 0));
    expect(memory.unitPathData.has(unit)).false;
  });

  it('should stop when the unit runs out of moves, keeping the rest of the path', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await testGame(
        '25G',
        5,
        5
      ),
      player = addPlayer(),
      unit = addUnit(Warrior, player, 0, 0),
      memory = createMemory();

    memory.unitPathData.set(
      unit,
      pathOf(world.get(1, 0), world.get(2, 0), world.get(3, 0))
    );

    expect(followPath(dependencies, player, memory, knowledge, unit)).to.equal(
      'out-of-moves'
    );
    expect(unit.tile()).to.equal(world.get(1, 0));
    expect(memory.unitPathData.get(unit)?.entries()).to.eql([
      world.get(2, 0),
      world.get(3, 0),
    ]);
  });

  it('should not step onto a tile it cannot move to, and forget the path', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await testGame(
        '2G1O2G',
        1,
        5
      ),
      player = addPlayer(),
      unit = addUnit(Horseman, player, 1, 0),
      memory = createMemory();

    memory.unitPathData.set(unit, pathOf(world.get(2, 0), world.get(3, 0)));

    expect(followPath(dependencies, player, memory, knowledge, unit)).to.equal(
      'blocked'
    );
    expect(unit.tile()).to.equal(world.get(1, 0));
    expect(memory.unitPathData.has(unit)).false;
  });

  it('should not take a step it could not come back from', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await testGame(
        '25G',
        5,
        5
      ),
      player = addPlayer(),
      unit = addUnit(Horseman, player, 0, 0),
      memory = createMemory();

    memory.unitPathData.set(unit, pathOf(world.get(1, 0)));

    expect(
      followPath(
        dependencies,
        player,
        memory,
        { ...knowledge, canReturnAfter: (): boolean => false },
        unit
      )
    ).to.equal('blocked');
    expect(unit.tile()).to.equal(world.get(0, 0));
  });

  it('should stop, without attacking, once another player’s unit is near', async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await testGame(
        '14G',
        2,
        7
      ),
      player = addPlayer(),
      other = addPlayer(),
      unit = addUnit(Horseman, player, 0, 0),
      enemy = addUnit(Warrior, other, 2, 1),
      memory = createMemory();

    memory.unitPathData.set(
      unit,
      pathOf(world.get(1, 0), world.get(2, 0), world.get(3, 0))
    );

    expect(followPath(dependencies, player, memory, knowledge, unit)).to.equal(
      'threatened'
    );
    expect(unit.tile()).to.equal(world.get(1, 0));
    expect(enemy.destroyed()).false;
    expect(memory.unitPathData.get(unit)?.entries()).to.eql([
      world.get(2, 0),
      world.get(3, 0),
    ]);
  });
});
