"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pursue = exports.nearest = void 0;
const Path_1 = require("@civ-clone/core-world-path/Path");
const reachable_1 = require("./reachable");
const nearest = (unit) => (a, b) => a.distanceFrom(unit.tile()) - b.distanceFrom(unit.tile());
exports.nearest = nearest;
// Sets `unit` off for the first target in `ranked` it has a path to, and takes that target off `list`. Returns whether
//  there was one. `ranked` is sometimes `list` itself, sorted in place, and sometimes a sorted copy of part of it.
const pursue = (dependencies, memory, unit, list, ranked) => {
    // Only worked out if there's a target to check.
    let reachable;
    for (const targetTile of ranked) {
        // Already there: a search would find nothing worth following.
        if (targetTile === unit.tile()) {
            continue;
        }
        if (reachable === undefined) {
            reachable = (0, reachable_1.default)(unit);
        }
        // Out of reach: a search would cover everywhere the unit can go and find nothing.
        if (reachable !== null && !reachable.has(targetTile)) {
            continue;
        }
        const path = Path_1.default.for(unit, unit.tile(), targetTile, dependencies.pathFinderRegistry);
        if (path) {
            list.splice(list.indexOf(targetTile), 1);
            memory.unitPathData.set(unit, path);
            return true;
        }
    }
    return false;
};
exports.pursue = pursue;
exports.default = exports.pursue;
//# sourceMappingURL=mission.js.map