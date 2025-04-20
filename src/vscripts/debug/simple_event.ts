import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { Hero } from './hero';
import { ckv } from '../utils/kv';

@reloadable
export class SimpleEvent_PlayerID {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_event', (_, data) => {
            const event = data.event as keyof SimpleEvent_PlayerID;
            if (typeof this[event] === 'function') {
                this[event](data.PlayerID);
            } else {
                console.error(`SimpleEvent_PlayerID: ${event} 事件不存在`);
            }
        });
    }

    get_camera_distance(PlayerID: PlayerID) {
        let v = GameRules.GetGameModeEntity().GetCameraDistanceOverride();
        v == 0 && (v = 1134);
        const player = PlayerResource.GetPlayer(PlayerID);
        CustomGameEventManager.Send_ServerToPlayer(
            player!,
            's2c_camera_distance',
            {
                distance: v
            }
        );
    }

    dummy_add(PlayerID: PlayerID) {
        const player = PlayerResource.GetPlayer(PlayerID);
        const hero = player?.GetAssignedHero();
        if (hero) {
            const origin = (hero.GetAbsOrigin() + RandomVector(300)) as Vector;
            CreateUnitByNameAsync(
                'npc_dota_hero_target_dummy',
                origin,
                true,
                undefined,
                undefined,
                DotaTeam.NEUTRALS,
                unit => {
                    unit.SetControllableByPlayer(PlayerID, false);
                    unit.Hold();
                    unit.SetIdleAcquire(false);
                }
            );
        }
    }

    day_night_cycle(PlayerID: PlayerID) {
        if (GameRules.IsDaytime()) {
            GameRules.SetTimeOfDay(0.751);
        } else {
            GameRules.SetTimeOfDay(0.251);
        }
    }

    get_native_hero_kv(PlayerID: PlayerID) {
        const kv_npc_heroes = ckv.get('npc_heroes');
        const kv_npc_heroes_custom = ckv.get('npc_heroes_custom');
        const data: IntermediateData[] = [];
        for (const key in kv_npc_heroes) {
            if (key != 'Version' && key != 'npc_dota_hero_base') {
                const info = kv_npc_heroes[key];
                let primary = Attributes.STRENGTH;
                switch (info.AttributePrimary) {
                    case 'DOTA_ATTRIBUTE_STRENGTH':
                        primary = Attributes.STRENGTH;
                        break;
                    case 'DOTA_ATTRIBUTE_AGILITY':
                        primary = Attributes.AGILITY;
                        break;
                    case 'DOTA_ATTRIBUTE_INTELLECT':
                        primary = Attributes.INTELLECT;
                    case 'DOTA_ATTRIBUTE_ALL':
                        primary = Attributes.ALL;
                }

                let facet_data = [];
                if (info.Facets) {
                    for (const key in info.Facets) {
                        console.warn(info.Facets[key].Deprecated);
                        if (
                            info.Facets?.[key]?.Deprecated === undefined ||
                            (info.Facets[key].Deprecated !== 'true' &&
                                info.Facets[key].Deprecated !== 'True' &&
                                info.Facets[key].Deprecated !== 1)
                        ) {
                            let facet_data_sigle = {
                                facet_name: key,
                                Icon: info.Facets[key].Icon,
                                Color: info.Facets[key].Color,
                                GradientID: info.Facets[key].GradientID
                            };
                            facet_data.push(facet_data_sigle);
                        }
                    }
                }

                let v_data = {
                    hero_name: key,
                    HeroOrderID: info.HeroOrderID,
                    AttributePrimary: primary,
                    Facets: facet_data
                };
                data.push(v_data);
            }
        }
        for (const key in kv_npc_heroes_custom) {
            if (kv_npc_heroes[key]) {
                const index = data.findIndex(item => item.hero_name === key);
                if (index !== -1) {
                    data.splice(index, 1);
                }
            }
        }

        CustomGameEventManager.Send_ServerToAllClients('s2c_native_hero_kv', {
            kv: data
        });
    }

    test(PlayerID: PlayerID) {
        const player = PlayerResource.GetPlayer(PlayerID);
        if (!player) return;

        Hero.prototype.create_facet_hero(
            PlayerID,
            'npc_dota_hero_earth_spirit',
            RandomInt(1, 2),
            DotaTeam.GOODGUYS,
            hero => {
                hero.SetControllableByPlayer(PlayerID, false);
                player.SetAssignedHeroEntity(hero);
            }
        );
    }

    test2(PlayerID: PlayerID) {
        const player = PlayerResource.GetPlayer(PlayerID);
        const hero = player?.GetAssignedHero();

        CreateUnitByNameAsync(
            'npc_test',
            hero?.GetAbsOrigin() as Vector,
            true,
            undefined,
            undefined,
            DotaTeam.GOODGUYS,
            hero => {
                hero.SetControllableByPlayer(PlayerID, false);
            }
        );
    }
}

@reloadable
export class SimpleEvent_Check {
    private fow_viewer_id: ViewerID | undefined;
    constructor() {
        CustomGameEventManager.RegisterListener(
            'c2s_check_event',
            (_, data) => {
                const event = data.event as keyof SimpleEvent_Check;
                if (typeof this[event] === 'function') {
                    this[event](
                        data.PlayerID,
                        data.checked == 1 ? true : false
                    );
                } else {
                    console.error(`SimpleEvent_Check: ${event} 事件不存在`);
                }
            }
        );
    }

    all_map_vision(PlayerID: PlayerID, checked: boolean) {
        if (checked) {
            if (this.fow_viewer_id == undefined) {
                this.fow_viewer_id = AddFOWViewer(
                    DotaTeam.GOODGUYS,
                    Vector(0, 0, 0),
                    99999,
                    99999,
                    false
                );
                CustomGameEventManager.Send_ServerToAllClients(
                    's2c_all_map_vision_state',
                    {
                        checked: true
                    }
                );
            }
        } else {
            if (this.fow_viewer_id) {
                RemoveFOWViewer(DotaTeam.GOODGUYS, this.fow_viewer_id);
                this.fow_viewer_id = undefined;
                CustomGameEventManager.Send_ServerToAllClients(
                    's2c_all_map_vision_state',
                    {
                        checked: false
                    }
                );
            }
        }
    }

    free_spells(PlayerID: PlayerID, checked: boolean) {
        if (checked) {
            if (this.fow_viewer_id == undefined) {
                this.fow_viewer_id = AddFOWViewer(
                    DotaTeam.GOODGUYS,
                    Vector(0, 0, 0),
                    99999,
                    99999,
                    false
                );
            }
        } else {
            if (this.fow_viewer_id) {
                RemoveFOWViewer(DotaTeam.GOODGUYS, this.fow_viewer_id);
                this.fow_viewer_id == undefined;
            }
        }
    }
}

@reloadable
export class SimpleEvent_Units {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_unit_event', (_, data) => {
            const event = data.event as keyof SimpleEvent_Units;
            if (typeof this[event] === 'function') {
                this[event](data.PlayerID, data.units);
            } else {
                console.error(`SimpleEvent_Units: ${event} 事件不存在`);
            }
        });
    }

    hero_reset(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC() && ent.IsHero()) {
                PlayerResource.ReplaceHeroWithNoTransfer(
                    PlayerID,
                    PlayerResource.GetSelectedHeroName(PlayerID),
                    PlayerResource.GetGold(PlayerID),
                    0
                );
                UTIL_Remove(ent);
            }
        }
    }

    level_up(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC() && ent.IsHero()) {
                ent.HeroLevelUp(true);
            }
        }
    }

    level_up_max(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC() && ent.IsHero()) {
                HeroMaxLevel(ent);
            }
        }
    }

    revive(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC() && ent.UnitCanRespawn() && ent.IsAlive()) {
                ent.RespawnUnit();
            }
        }
    }

    refresh(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent?.IsBaseNPC()) {
                ent.SetHealth(ent.GetMaxHealth());
                ent.SetMana(ent.GetMaxMana());
                for (let i = 0; i < ent.GetAbilityCount(); i++) {
                    const ability = ent.GetAbilityByIndex(i);
                    if (ability && ability.GetLevel() > 0) {
                        ability.EndCooldown();
                        ability.RefreshCharges();
                    }
                }
                if (ent.IsHero()) {
                    for (let i = 0; i < ent.GetNumItemsInInventory(); i++) {
                        const item = ent.GetItemInSlot(i);
                        if (item) {
                            item.EndCooldown();
                        }
                    }
                }
            }
        }
    }

    ent_remove(PlayerID: PlayerID, units?: { [key: string]: EntityIndex }) {
        for (const unit in units) {
            const ent = EntIndexToHScript(units[unit]);
            if (ent) {
                if (ent?.IsBaseNPC() && ent.IsHero()) {
                    for (let i = 0; i < ent.GetNumItemsInInventory(); i++) {
                        const item = ent.GetItemInSlot(i);
                        if (item) {
                            UTIL_Remove(item);
                        }
                    }

                    if (ent.IsRealHero()) {
                        if (ent.GetPlayerOwner() != null) {
                            Hero.prototype.remove_hero_owner(ent);
                            DisconnectClient(ent.GetPlayerID(), true);
                            return;
                        } else {
                            Hero.prototype.remove_hero(ent);
                            return;
                        }
                    }
                }
                UTIL_Remove(ent);
            }
        }
    }
}
