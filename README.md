# base-strategy-ai

The generic toolkit computer players' strategies are built on, and standing orders for a player's units. It knows no
ruleset: a ruleset's judgements come in through `Knowledge`. `simple-ai-client` builds its Civ1 strategy pack on it.
See civ-clone/web-renderer#153, #198 and #200.

- `lib/Dependencies`: the registries, engine and random number generator the strategies act through
  (`createDependencies`, and `dependenciesFor(game)` for a game's own).
- `lib/Knowledge`: the ruleset-specific judgements the generic routines defer to, `MartialLawPolicy` among them.
- `lib/Memory`, `lib/MemoryRegistry`: each player's working memory (targets, unit paths, recent moves, uncalmed
  cities), looked up by player.
- `lib/Turn/surveyTargets`: the start-of-turn survey that refills the target board, saved as a `StrategyNote`
  (`simple-ai-client:survey`, kept from before the split so saved games resume).
- `lib/Unit/mission`: `Mission`, `nearest` and `pursue`, how a unit sets off for the nearest target it can reach.
- `lib/Unit/unitTurnContext`, `Strategies/lib/unitTurnContextFor`: what a unit's turn reads once, shared by the unit
  strategies. `unit.actions()` creates `Action`s, whose ids are part of the game's state, so it's read once per turn.
- `lib/actionLookup`, `lib/Unit/orders`, `lib/Unit/reachable`, `Strategies/lib/AIStrategy`,
  `Strategies/lib/isUnitAction`: smaller helpers.

## Standing orders

A standing order runs a strategy for one of a player's units, such as a human player's automated explorer:

- `PlayerActions/UnitOrder`: `new UnitOrder(player, unit)`, the action an order is given. It is never a mandatory
  action, and has ids of its own.
- `Strategies/lib/OrderStrategy`: `interface OrderStrategy { order(action: UnitOrder): boolean }`. `order` is
  synchronous and returns `false` when the unit should be handed back to its player. `findStrategy(registry, Type)`
  finds the game's instance of a strategy, and `isOrderStrategy(strategy)` tells whether it takes orders.
- `lib/Unit/followPath`: `followPath(dependencies, player, memory, knowledge, unit)` walks the unit along its path in
  memory, synchronously, taking only moves (never attacking, capturing or negotiating), and honouring
  `Knowledge#canReturnAfter`. It returns `'arrived'`, `'blocked'` (the path is forgotten), `'threatened'` or
  `'out-of-moves'` (the rest of the path is kept).
- `lib/Unit/enemyAdjacent`: `enemyAdjacent(dependencies, player, unit)`, whether another player's unit is on any tile
  the unit can see, the test that wakes a sleeping unit.
