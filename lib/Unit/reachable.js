"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reachableTiles = exports.terrainFor = void 0;
// Generic: the tiles a unit could reach from where it stands, moving the way `simple-world-path`'s `BasePathFinder`
//  does: a land unit by land, a ship by sea. `null` for any other unit, which could go anywhere.
const Land_1 = require("@civ-clone/base-unit-type-land/Land");
const Naval_1 = require("@civ-clone/base-unit-type-naval/Naval");
// Whether `unit` can move onto a tile, by its terrain alone: land for a land unit, water for a ship. `null` for any
//  other unit, which can move onto any tile.
const terrainFor = (unit) => unit instanceof Land_1.default
    ? (tile) => tile.isLand()
    : unit instanceof Naval_1.default
        ? (tile) => tile.isWater()
        : null;
exports.terrainFor = terrainFor;
let found = null;
const kindsFor = (turn) => {
    if (found === null || found.turn !== turn) {
        found = { turn, byKind: { land: new WeakMap(), sea: new WeakMap() } };
    }
    return found.byKind;
};
// One pass over the unit's continent or sea. Checking targets against it saves a path search over the whole of it for
//  each target the unit can't reach, such as the coast of another continent that a ship has seen.
//
// Given the `turn`, each continent and sea is crossed once that turn and the set shared by every unit on it, so not for
//  changing: every unit given a mission asked for its own, for each mission it was offered, and most of a player's
//  units share a few continents (civ-clone/web-renderer#316). No rule turns land into sea or sea into land, but what's
//  found is only kept for the turn all the same. From a tile the unit couldn't move on to, such as a land unit aboard a
//  ship, what it reaches is the land all around, which isn't one continent, so it's found afresh.
const reachableTiles = (unit, turn) => {
    const canEnter = (0, exports.terrainFor)(unit);
    if (canEnter === null) {
        return null;
    }
    const start = unit.tile(), byKind = turn !== undefined && canEnter(start)
        ? kindsFor(turn)[unit instanceof Land_1.default ? 'land' : 'sea']
        : null, known = byKind === null || byKind === void 0 ? void 0 : byKind.get(start);
    if (known) {
        return known;
    }
    const reached = new Set([start]), queue = [start];
    for (let i = 0; i < queue.length; i++) {
        queue[i].getNeighbours().forEach((tile) => {
            if (!reached.has(tile) && canEnter(tile)) {
                reached.add(tile);
                queue.push(tile);
            }
        });
    }
    if (byKind) {
        reached.forEach((tile) => {
            byKind.set(tile, reached);
        });
    }
    return reached;
};
exports.reachableTiles = reachableTiles;
exports.default = exports.reachableTiles;
//# sourceMappingURL=reachable.js.map