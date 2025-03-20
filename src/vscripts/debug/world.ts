import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class World {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_rune_event', (_, data) => {
            this.SpawnRune(data.PlayerID, data.type);
        });
    }

    SpawnRune(PlayerID: PlayerID, type: string) {
        const player = PlayerResource.GetPlayer(PlayerID);
        const hero = player?.GetAssignedHero();
        if (!hero) return;
        let rune_type;
        switch (type) {
            case 'DOUBLEDAMAGE':
                rune_type = RuneType.DOUBLEDAMAGE;
                break;
            case 'HASTE':
                rune_type = RuneType.HASTE;
                break;
            case 'ILLUSION':
                rune_type = RuneType.ILLUSION;
                break;
            case 'INVISIBILITY':
                rune_type = RuneType.INVISIBILITY;
                break;
            case 'REGENERATION':
                rune_type = RuneType.REGENERATION;
                break;
            case 'ARCANE':
                rune_type = RuneType.ARCANE;
                break;
            case 'SHIELD':
                rune_type = RuneType.SHIELD;
                break;
        }
        if (!rune_type) return;
        const fDistance = 200.0;
        const fMinSeparation = 50.0;
        const fRingOffset = fMinSeparation + 20.0;
        const vDir = hero.GetForwardVector();
        const vInitialTarget = (hero.GetAbsOrigin() +
            vDir * fDistance) as Vector;
        vInitialTarget.z = GetGroundHeight(vInitialTarget, undefined);
        let vTarget = vInitialTarget;
        let nRemainingAttempts = 100;
        let fAngle = 2 * math.pi;
        let fOffset = 0.0;
        let bDone = false;
        const vecRunes = Entities.FindAllByClassname('dota_item_rune');
        while (!bDone && nRemainingAttempts > 0) {
            bDone = true;

            for (const rune of vecRunes) {
                const runePos = rune.GetAbsOrigin();
                const distance = ((runePos - vTarget) as Vector).Length();
                if (distance < fMinSeparation) {
                    bDone = false;
                    break;
                }
            }

            // 检查路径可达性
            if (bDone && !GridNav.CanFindPath(hero.GetAbsOrigin(), vTarget)) {
                bDone = false;
            }

            // 需要调整位置
            if (!bDone) {
                fAngle += (2 * Math.PI) / 8;
                if (fAngle >= 2 * Math.PI) {
                    fOffset += fRingOffset;
                    fAngle = 0;
                }

                vTarget = (vInitialTarget +
                    fOffset *
                        Vector(
                            math.cos(fAngle),
                            math.sin(fAngle),
                            0.0
                        )) as Vector;
                vTarget.z = GetGroundHeight(vTarget, undefined);

                nRemainingAttempts--;
            }
        }

        CreateRune(vTarget, rune_type);
    }
}
