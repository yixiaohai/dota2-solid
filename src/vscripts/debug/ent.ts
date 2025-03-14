import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class Ent {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_ent_move', (_, data) => {
            this.Move(data.pos, data.units);
        });
    }

    Move(
        pos: { x: number; y: number; z: number },
        units?: { [key: string]: EntityIndex }
    ) {
        const point = GetGroundPosition(Vector(pos.x, pos.y, pos.z), undefined);
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC()) {
                ent.SetAbsOrigin(point);
                FindClearSpaceForUnit(ent, point, true);
            }
        }
    }
}
