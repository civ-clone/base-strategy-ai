// Generic: the registries, engine, random number generator and player memory the AI reads and acts through.
import {
  AvailableSpecialistRegistry,
  instance as availableSpecialistRegistryInstance,
} from '@civ-clone/core-city/AvailableSpecialistRegistry';
import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityGrowthRegistry,
  instance as cityGrowthRegistryInstance,
} from '@civ-clone/core-city-growth/CityGrowthRegistry';
import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import {
  ClientRegistry,
  instance as clientRegistryInstance,
} from '@civ-clone/core-client/ClientRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  GoodyHutRegistry,
  instance as goodyHutRegistryInstance,
} from '@civ-clone/core-goody-hut/GoodyHutRegistry';
import {
  InteractionRegistry,
  instance as interactionRegistryInstance,
} from '@civ-clone/core-diplomacy/InteractionRegistry';
import {
  PathFinderRegistry,
  instance as pathFinderRegistryInstance,
} from '@civ-clone/core-world-path/PathFinderRegistry';
import {
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  PlayerGovernmentRegistry,
  instance as playerGovernmentRegistryInstance,
} from '@civ-clone/core-government/PlayerGovernmentRegistry';
import {
  PlayerResearchRegistry,
  instance as playerResearchRegistryInstance,
} from '@civ-clone/core-science/PlayerResearchRegistry';
import {
  PlayerTradeRatesRegistry,
  instance as playerTradeRatesRegistryInstance,
} from '@civ-clone/core-trade-rate/PlayerTradeRatesRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  PlayerWorldRegistry,
  instance as playerWorldRegistryInstance,
} from '@civ-clone/core-player-world/PlayerWorldRegistry';
import {
  RequirementRegistry,
  instance as requirementRegistryInstance,
} from '@civ-clone/core-requirement/RequirementRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import {
  SpecialistRegistry,
  instance as specialistRegistryInstance,
} from '@civ-clone/core-city/SpecialistRegistry';
import {
  StrategyNoteRegistry,
  instance as strategyNoteRegistryInstance,
} from '@civ-clone/core-strategy/StrategyNoteRegistry';
import {
  TerrainFeatureRegistry,
  instance as terrainFeatureRegistryInstance,
} from '@civ-clone/core-terrain-feature/TerrainFeatureRegistry';
import {
  TileImprovementRegistry,
  instance as tileImprovementRegistryInstance,
} from '@civ-clone/core-tile-improvement/TileImprovementRegistry';
import {
  TraitRegistry,
  instance as traitRegistryInstance,
} from '@civ-clone/core-civilization/TraitRegistry';
import {
  Turn,
  instance as turnInstance,
} from '@civ-clone/core-turn-based-game/Turn';
import {
  UnitImprovementRegistry,
  instance as unitImprovementRegistryInstance,
} from '@civ-clone/core-unit-improvement/UnitImprovementRegistry';
import {
  UnitRegistry,
  instance as unitRegistryInstance,
} from '@civ-clone/core-unit/UnitRegistry';
import {
  WorkedTileRegistry,
  instance as workedTileRegistryInstance,
} from '@civ-clone/core-city/WorkedTileRegistry';
import {
  MemoryRegistry,
  instance as memoryRegistryInstance,
} from './MemoryRegistry';
import { Game } from '@civ-clone/core-game/Game';
import { instance as rngInstance } from '@civ-clone/core-random';

// Everything here is shared by every player: the player a routine acts for is always passed alongside, never kept here.
export interface Dependencies {
  availableSpecialistRegistry: AvailableSpecialistRegistry;
  cityBuildRegistry: CityBuildRegistry;
  cityGrowthRegistry: CityGrowthRegistry;
  cityImprovementRegistry: CityImprovementRegistry;
  cityRegistry: CityRegistry;
  clientRegistry: ClientRegistry;
  engine: Engine;
  goodyHutRegistry: GoodyHutRegistry;
  interactionRegistry: InteractionRegistry;
  memoryRegistry: MemoryRegistry;
  pathFinderRegistry: PathFinderRegistry;
  pendingEffectRegistry: PendingEffectRegistry;
  playerGovernmentRegistry: PlayerGovernmentRegistry;
  playerResearchRegistry: PlayerResearchRegistry;
  playerTradeRatesRegistry: PlayerTradeRatesRegistry;
  playerTreasuryRegistry: PlayerTreasuryRegistry;
  playerWorldRegistry: PlayerWorldRegistry;
  randomNumberGenerator: () => number;
  // What the ruleset's things need and are made obsolete by (civ-clone/web-renderer#37), e.g. whether a Wonder still
  //  does anything.
  requirementRegistry: RequirementRegistry;
  ruleRegistry: RuleRegistry;
  specialistRegistry: SpecialistRegistry;
  strategyNoteRegistry: StrategyNoteRegistry;
  terrainFeatureRegistry: TerrainFeatureRegistry;
  tileImprovementRegistry: TileImprovementRegistry;
  traitRegistry: TraitRegistry;
  turn: Turn;
  unitImprovementRegistry: UnitImprovementRegistry;
  unitRegistry: UnitRegistry;
  workedTileRegistry: WorkedTileRegistry;
}

// The module-level singletons, the same defaults `SimpleAIClient`'s constructor has, with any of them replaced.
export const createDependencies = (
  dependencies: Partial<Dependencies> = {}
): Dependencies => ({
  availableSpecialistRegistry: availableSpecialistRegistryInstance,
  cityBuildRegistry: cityBuildRegistryInstance,
  cityGrowthRegistry: cityGrowthRegistryInstance,
  cityImprovementRegistry: cityImprovementRegistryInstance,
  cityRegistry: cityRegistryInstance,
  clientRegistry: clientRegistryInstance,
  engine: engineInstance,
  goodyHutRegistry: goodyHutRegistryInstance,
  interactionRegistry: interactionRegistryInstance,
  memoryRegistry: memoryRegistryInstance,
  pathFinderRegistry: pathFinderRegistryInstance,
  pendingEffectRegistry: pendingEffectRegistryInstance,
  playerGovernmentRegistry: playerGovernmentRegistryInstance,
  playerResearchRegistry: playerResearchRegistryInstance,
  playerTradeRatesRegistry: playerTradeRatesRegistryInstance,
  playerTreasuryRegistry: playerTreasuryRegistryInstance,
  playerWorldRegistry: playerWorldRegistryInstance,
  randomNumberGenerator: rngInstance,
  requirementRegistry: requirementRegistryInstance,
  ruleRegistry: ruleRegistryInstance,
  specialistRegistry: specialistRegistryInstance,
  strategyNoteRegistry: strategyNoteRegistryInstance,
  terrainFeatureRegistry: terrainFeatureRegistryInstance,
  tileImprovementRegistry: tileImprovementRegistryInstance,
  traitRegistry: traitRegistryInstance,
  turn: turnInstance,
  unitImprovementRegistry: unitImprovementRegistryInstance,
  unitRegistry: unitRegistryInstance,
  workedTileRegistry: workedTileRegistryInstance,
  ...dependencies,
});

// The game's registries, as the strategies take them.
export const dependenciesFor = (game: Game): Dependencies =>
  createDependencies({
    availableSpecialistRegistry: game.availableSpecialists,
    cityBuildRegistry: game.cityBuilds,
    cityGrowthRegistry: game.cityGrowth,
    cityImprovementRegistry: game.cityImprovements,
    cityRegistry: game.cities,
    clientRegistry: game.clients,
    engine: game.engine,
    goodyHutRegistry: game.goodyHuts,
    interactionRegistry: game.interactions,
    pathFinderRegistry: game.pathFinders,
    pendingEffectRegistry: game.pendingEffects,
    playerGovernmentRegistry: game.playerGovernments,
    playerResearchRegistry: game.playerResearch,
    playerTradeRatesRegistry: game.playerTradeRates,
    playerTreasuryRegistry: game.playerTreasuries,
    playerWorldRegistry: game.playerWorlds,
    randomNumberGenerator: game.rng,
    requirementRegistry: game.requirements,
    ruleRegistry: game.rules,
    specialistRegistry: game.specialists,
    strategyNoteRegistry: game.strategyNotes,
    terrainFeatureRegistry: game.terrainFeatures,
    tileImprovementRegistry: game.tileImprovements,
    traitRegistry: game.traits,
    turn: game.turn,
    unitImprovementRegistry: game.unitImprovements,
    unitRegistry: game.units,
    workedTileRegistry: game.workedTiles,
  });

export default Dependencies;
