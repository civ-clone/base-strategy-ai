"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStrategy = exports.isOrderStrategy = void 0;
const isOrderStrategy = (strategy) => typeof strategy.order === 'function';
exports.isOrderStrategy = isOrderStrategy;
// The first strategy in `registry` of type `StrategyType`, such as the game's `Explore`, to run an order with. `null`
//  when none is registered.
const findStrategy = (registry, StrategyType) => {
    var _a;
    return (_a = registry
        .entries()
        .find((strategy) => strategy instanceof StrategyType)) !== null && _a !== void 0 ? _a : null;
};
exports.findStrategy = findStrategy;
//# sourceMappingURL=OrderStrategy.js.map