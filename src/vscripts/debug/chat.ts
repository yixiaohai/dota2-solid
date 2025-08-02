import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class Chat {
    constructor() {
        print('Chat');
        ListenToGameEvent(`player_chat`, keys => this.OnPlayerChat(keys), this);
    }

    OnPlayerChat(keys: GameEventProvidedProperties & PlayerChatEvent): void {
        DeepPrintTable(keys);
        let strs = keys.text.split(' ');
        let cmd = strs[0];
        let args = strs.slice(1);
        const PlayerID = keys.playerid;

        if (cmd === '-test1') {
            const player = PlayerResource.GetPlayer(PlayerID);
            const hero = player?.GetAssignedHero();
            if (!hero) return;
            let units: CDOTA_BaseNPC[] = FindUnitsInRadius(
                hero.GetTeamNumber(),
                hero.GetAbsOrigin(),
                undefined,
                2000,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO + UnitTargetType.BASIC + UnitTargetType.BUILDING,
                0,
                FindOrder.CLOSEST,
                false
            );
            if (units.length > 0) {
                hero.MoveToTargetToAttack(units[0]);
            }
        }

        if (cmd === '-test2') {
            const player = PlayerResource.GetPlayer(PlayerID);
            const hero = player?.GetAssignedHero();
            if (!hero) return;
            let units: CDOTA_BaseNPC[] = FindUnitsInRadius(
                hero.GetTeamNumber(),
                hero.GetAbsOrigin(),
                undefined,
                2000,
                UnitTargetTeam.ENEMY,
                UnitTargetType.HERO + UnitTargetType.BASIC + UnitTargetType.BUILDING,
                0,
                FindOrder.FARTHEST,
                false
            );
            if (units.length > 0) {
                hero.MoveToTargetToAttack(units[0]);
            }
        }
    }
}
