import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { Hero } from './hero';
import * as json from '../kv/testexcel.json';

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

    test(PlayerID: PlayerID) {
        const player = PlayerResource.GetPlayer(PlayerID);
        const hero = player?.GetAssignedHero();
        console.warn(json.testexcel1);
        // let ent = Entities.First();
        // while (ent != null) {
        //     print(ent.GetClassname());
        //     const ent_next = Entities.Next(ent);
        //     if (ent_next == null) {
        //         break;
        //     }
        //     ent = ent_next;
        // }
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
        console.warn(checked);
        console.warn(this.fow_viewer_id);
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
