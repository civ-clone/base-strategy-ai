"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.followPath = exports.peacefulMoves = void 0;
const CaptureCity_1 = require("@civ-clone/base-unit-action-capture-city/CaptureCity");
const Move_1 = require("@civ-clone/base-unit-action-move/Move");
const enemyAdjacent_1 = require("./enemyAdjacent");
// The moves the unit could make onto `tile`, of `actions`: a plain move first, then any other kind of move (onto a
//  ship, off one, landing), but never capturing a city, which is an attack.
const peacefulMoves = (actions) => {
    const moves = actions.filter((action) => action instanceof Move_1.default && !(action instanceof CaptureCity_1.default));
    return [
        ...moves.filter((action) => action.constructor === Move_1.default),
        ...moves.filter((action) => action.constructor !== Move_1.default),
    ];
};
exports.peacefulMoves = peacefulMoves;
// How many steps at most in one call, however the rules treat a move: a unit whose moves never run out stops anyway.
const STEP_LIMIT = 1e3;
const followPath = (dependencies, player, memory, knowledge, unit) => {
    for (let steps = 0; steps < STEP_LIMIT; steps++) {
        const path = memory.unitPathData.get(unit);
        if (!path || path.length === 0) {
            memory.unitPathData.delete(unit);
            return 'arrived';
        }
        if (!unit.active() || unit.moves().value() < 0.1) {
            return 'out-of-moves';
        }
        if ((0, enemyAdjacent_1.default)(dependencies, player, unit)) {
            return 'threatened';
        }
        const next = path.start(), [move] = next.isNeighbourOf(unit.tile())
            ? (0, exports.peacefulMoves)(unit.actions(next))
            : [];
        if (!move || !knowledge.canReturnAfter(dependencies, player, unit, move)) {
            memory.unitPathData.delete(unit);
            return 'blocked';
        }
        path.shift();
        unit.action(move);
        const lastMoves = memory.lastUnitMoves.get(unit) || [];
        lastMoves.push(next);
        memory.lastUnitMoves.set(unit, lastMoves.slice(-50));
    }
    return 'out-of-moves';
};
exports.followPath = followPath;
exports.default = exports.followPath;
//# sourceMappingURL=followPath.js.map