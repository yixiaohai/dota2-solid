import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class Hero {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_hero_reset', (_, data) => {
            this.Reset(data.PlayerID);
        });
    }

    Reset(PlayerID: PlayerID) {
        console.log('reset');
        const player = PlayerResource.GetPlayer(PlayerID);
        if (player) {
            const hero = player.GetAssignedHero();
            const pos = hero.GetAbsOrigin();
            hero.RemoveSelf();
            CreateUnitByNameAsync(
                'npc_dota_hero_ursa',
                pos,
                true,
                player,
                player,
                DotaTeam.GOODGUYS,
                (unit: CDOTA_BaseNPC) => {
                    // 忽略第一个参数
                    console.log('Unit:', unit);
                    player.SetAssignedHeroEntity(unit);
                    unit.SetControllableByPlayer(PlayerID, false);
                }
            );
        }
    }

    SpawnCallback() {
        console.log('spawn_callback');
    }
}
