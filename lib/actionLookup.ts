// Generic: a unit's available actions keyed by name, so a routine can ask whether it can, say, fortify here.
import Action from '@civ-clone/core-unit/Action';
import Attack from '@civ-clone/base-unit-action-attack/Attack';
import BuildIrrigation from '@civ-clone/base-unit-action-build-irrigation/BuildIrrigation';
import BuildMine from '@civ-clone/base-unit-action-build-mine/BuildMine';
import BuildRoad from '@civ-clone/base-unit-action-build-road/BuildRoad';
import CaptureCity from '@civ-clone/base-unit-action-capture-city/CaptureCity';
import Disband from '@civ-clone/base-unit-action-disband/Disband';
import Disembark from '@civ-clone/base-unit-action-disembark/Disembark';
import Embark from '@civ-clone/base-unit-action-embark/Embark';
import Fortify from '@civ-clone/base-unit-action-fortify/Fortify';
import FoundCity from '@civ-clone/base-unit-action-found-city/FoundCity';
import JoinCity from '@civ-clone/base-unit-action-join-city/JoinCity';
import NoOrders from '@civ-clone/base-unit-action-no-orders/NoOrders';
import Unload from '@civ-clone/base-unit-action-unload/Unload';

// The actions the generic routines ask for by name are typed. Any other action is there under its own name too, for a
//  ruleset's routines to narrow to its own classes (`setHomeCity`, `sneakAttack`, ...).
export type ActionLookup = {
  [name: string]: unknown;
  attack?: Attack;
  buildIrrigation?: BuildIrrigation;
  buildMine?: BuildMine;
  buildRoad?: BuildRoad;
  captureCity?: CaptureCity;
  disband?: Disband;
  disembark?: Disembark;
  embark?: Embark;
  fortify?: Fortify;
  foundCity?: FoundCity;
  joinCity?: JoinCity;
  noOrders?: NoOrders;
  unload?: Unload;
};

// Keyed by class name with its first letter lowered. A later action of the same class replaces an earlier one.
export const lookupActions = (actions: Action[]): ActionLookup =>
  actions.reduce(
    (object: ActionLookup, entity: Action): ActionLookup => ({
      ...object,
      [entity.constructor.name.replace(/^./, (char: string): string =>
        char.toLowerCase()
      )]: entity,
    }),
    {}
  );

export default lookupActions;
