"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enemyAdjacent = void 0;
const enemyAdjacent = (dependencies, player, unit) => unit
    .tile()
    .getSurroundingArea(unit.visibility().value())
    .some((tile) => dependencies.unitRegistry
    .getByTile(tile)
    .some((other) => other.player() !== player));
exports.enemyAdjacent = enemyAdjacent;
exports.default = exports.enemyAdjacent;
//# sourceMappingURL=enemyAdjacent.js.map