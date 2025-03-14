import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class SimpleEvent_Units {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_unit_event', (_, data) => {
            const event = data.event as keyof SimpleEvent_Units;
            if (typeof this[event] === 'function') {
                this[event](data.PlayerID, data.units);
            } else {
                console.error('Hero:', event, '事件不存在');
            }
        });
    }

    Reset(PlayerID: PlayerID, units?: { [key: number]: EntityIndex }) {
        console.log('reset');
        const player = PlayerResource.GetPlayer(PlayerID);
        if (player) {
            const hero = player.GetAssignedHero();
            const pos = hero.GetAbsOrigin();
        }
    }
}
