import { Trireme, Warrior } from '@civ-clone/civ1-unit/Units';
import Tile from '@civ-clone/core-world/Tile';
import { expect } from 'chai';
import { createMemory } from '../lib/Memory';
import pursue from '../lib/Unit/mission';
import reachableTiles from '../lib/Unit/reachable';
import testGame from './lib/testGame';

// How often `tile`'s neighbours are asked for from now on: once each time a search crosses it.
const countNeighbours = (tile: Tile): (() => number) => {
  const getNeighbours = tile.getNeighbours.bind(tile);
  let calls = 0;

  tile.getNeighbours = (): Tile[] => {
    calls++;

    return getNeighbours();
  };

  return (): number => calls;
};

const at = (tiles: Iterable<Tile>): string[] =>
  [...tiles].map((tile: Tile): string => `${tile.x()},${tile.y()}`).sort();

// Two continents of Grassland, with Ocean between them both ways round the map.
//   012345
// 0 GGOGGO
// 1 GGOGGO
// 2 GGOGGO
const continents = () => testGame('2G1O2G1O'.repeat(3), 3, 6);

describe('reachableTiles', (): void => {
  it("should be the unit's continent for a land unit and its sea for a ship", async (): Promise<void> => {
    const { addPlayer, addUnit } = await continents(),
      player = addPlayer();

    expect(at(reachableTiles(addUnit(Warrior, player, 0, 1))!)).to.deep.equal([
      '0,0',
      '0,1',
      '0,2',
      '1,0',
      '1,1',
      '1,2',
    ]);
    expect(at(reachableTiles(addUnit(Trireme, player, 2, 1))!)).to.deep.equal([
      '2,0',
      '2,1',
      '2,2',
    ]);
  });

  it('should find the same tiles given the turn as without it', async (): Promise<void> => {
    const { addPlayer, addUnit, world } = await continents(),
      player = addPlayer();

    world.entries().forEach((tile: Tile): void => {
      [Warrior, Trireme].forEach((UnitType): void => {
        const unit = addUnit(UnitType, player, tile.x(), tile.y());

        expect(at(reachableTiles(unit, 1)!)).to.deep.equal(
          at(reachableTiles(unit)!)
        );
      });
    });
  });

  // civ-clone/web-renderer#316
  it('should cross each continent once a turn for every unit on it, given the turn', async (): Promise<void> => {
    const { addPlayer, addUnit, world } = await continents(),
      player = addPlayer(),
      tile = world.get(1, 1),
      first = addUnit(Warrior, player, 0, 0),
      second = addUnit(Warrior, player, 1, 2);

    const crossings = countNeighbours(tile),
      reachable = reachableTiles(first, 1);

    expect(reachableTiles(second, 1)).to.equal(reachable);
    expect(reachableTiles(first, 1)).to.equal(reachable);
    expect(crossings()).to.equal(1);

    // The other continent, the sea, and each again the next turn, are crossed afresh.
    expect(reachableTiles(addUnit(Warrior, player, 3, 1), 1)).not.to.equal(
      reachable
    );
    expect(reachableTiles(addUnit(Trireme, player, 2, 1), 1)).not.to.equal(
      reachable
    );
    expect(reachableTiles(first, 2)).not.to.equal(reachable);
    expect(crossings()).to.equal(2);

    // Without the turn, every time.
    reachableTiles(first);

    expect(crossings()).to.equal(3);
  });

  it('should find the land all round a land unit aboard a ship afresh, as it is no one continent', async (): Promise<void> => {
    const { addPlayer, addUnit } = await continents(),
      player = addPlayer(),
      aboard = addUnit(Warrior, player, 2, 1),
      reachable = reachableTiles(aboard, 1)!;

    expect(at(reachable)).to.include.members(['1,1', '3,1']);
    expect(reachableTiles(aboard, 1)).not.to.equal(reachable);
    expect(reachableTiles(addUnit(Warrior, player, 1, 1), 1)).not.to.equal(
      reachable
    );
  });
});

describe('pursue', (): void => {
  // civ-clone/web-renderer#316
  it("should check targets against the unit's continent as found for the turn", async (): Promise<void> => {
    const { addPlayer, addUnit, dependencies, world } = await continents(),
      player = addPlayer(),
      memory = createMemory(),
      unit = addUnit(Warrior, player, 0, 0),
      target = world.get(1, 1),
      targets = [target];

    // What `pursue` will be handed, for the game's turn. Nothing else takes a tile out of it; this does, to see it used.
    reachableTiles(unit, dependencies.turn.value())!.delete(target);

    expect(pursue(dependencies, memory, unit, targets, [...targets])).false;
    expect(memory.unitPathData.has(unit)).false;

    // Next turn, it's found afresh.
    dependencies.turn.increment();

    expect(pursue(dependencies, memory, unit, targets, [...targets])).true;
    expect(memory.unitPathData.has(unit)).true;
    expect(targets).empty;
  });
});
