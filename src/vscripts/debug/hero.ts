import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class Hero {
    constructor() {}

    remove_hero_owner(hero: CDOTA_BaseNPC_Hero) {
        let ent = Entities.First();
        while (ent != null) {
            if (ent.GetOwner() == hero && ent != hero) {
                UTIL_Remove(ent);
            }
            const ent_next = Entities.Next(ent);
            if (ent_next == null) {
                break;
            }
            ent = ent_next;
        }
    }
    remove_hero(hero: CDOTA_BaseNPC_Hero) {
        this.remove_hero_owner(hero);
        UTIL_Remove(hero);
    }

    create_facet_hero(
        PlayerID: PlayerID,
        hero_name: string,
        facet_id: number,
        team: DotaTeam,
        callback: (hero: CDOTA_BaseNPC) => void
    ) {
        const player = PlayerResource.GetPlayer(PlayerID);
        if (!player) {
            console.error(`Hero create_hero:PlayerID有误`);
            return;
        }
        const good_player_count = PlayerResource.GetPlayerCountForTeam(
            DotaTeam.GOODGUYS
        );
        const good_player_max = GameRules.GetCustomGameTeamMaxPlayers(
            DotaTeam.GOODGUYS
        );

        if (good_player_count == good_player_max) {
            GameRules.SetCustomGameTeamMaxPlayers(
                DotaTeam.GOODGUYS,
                good_player_max + 1
            );
        }

        DebugCreateHeroWithVariant(
            player,
            hero_name,
            facet_id,
            DotaTeam.GOODGUYS,
            false,
            /** @noSelf */ (hero: CDOTA_BaseNPC_Hero) => {
                CreateUnitByNameAsync(
                    hero_name,
                    Vector(0, 0, 0),
                    true,
                    undefined,
                    hero,
                    team,
                    /** @noSelf */ ent => {
                        callback?.(ent);
                        DisconnectClient(hero.GetPlayerID(), true);
                    }
                );
            }
        );
    }
}
