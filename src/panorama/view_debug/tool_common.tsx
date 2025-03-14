import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../functions/console';
import { timer } from '../functions/timer';
import { create } from 'lodash';
import { createSignal } from 'solid-js';
import { mouseManager } from '../components/cursor';

const main = css`
    flow-children: down;
    width: 300px;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    transform: translateX(0px) translateY(60px);
    opacity: 1;
    transition-property: opacity, transform;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;

    .minimized & {
        opacity: 0;
        transform: translateX(-350px) translateY(60px);
    }

    .content {
        flow-children: down;
    }
`;

const row = css`
    flow-children: right;
`;

const collapseItem_unit: CollapseProps['items'] = [
    {
        key: 'unit',
        label: '#unit',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={row}>
                    <CButton
                        text="#hero_reset"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'hero_reset',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton text="#hero_replace" flow onClick={HeroReplace} />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#level_up"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'level_up',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton
                        text="#level_up_max"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'level_up_max',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#revive"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'revive',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton
                        text="#refresh"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'refresh',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#dummy_add"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'dummy_add'
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#hero_add_friend"
                        color="green"
                        flow
                        onClick={HeroAddFriend}
                    />
                    <CButton
                        text="#hero_add_enemy"
                        color="red"
                        flow
                        onClick={HeroAddEnemy}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#ent_info"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_info',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton
                        text="#ent_kv"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_kv',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#ent_abilities"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_abilities',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton
                        text="#ent_items"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_items',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#ent_modifiers"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_modifiers',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton
                        text="#ent_states"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_states',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#ent_remove"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'ent_remove',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            )
                        }
                    />
                    <CButton text="#ent_move" flow onClick={EntMove} />
                </Panel>
            </Panel>
        )
    }
];
const collapseItem_world: CollapseProps['items'] = [
    {
        key: 'world',
        label: '#world',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={row}>
                    <CButton
                        text="#all_map_vision"
                        flow
                        onClick={() => {
                        }}
                    />
                    <CButton text="#free_spells" flow onClick={() => { }} />
                </Panel>
                <Panel class={row}>
                    <CButton text="#day_night_cycle" flow onClick={() => { }} />
                    <CButton text="#host_timescale" flow onClick={() => { }} />
                </Panel>
            </Panel>
        )
    }
];
const collapseItem_ui: CollapseProps['items'] = [
    {
        key: 'ui',
        label: '#ui',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={row}>
                    <CButton
                        text="#default_UI"
                        flow
                        onClick={() => {
                            layer.toggle('default_ui', 'center');
                        }}
                    />
                    <CButton text="#camera_distance" flow onClick={() => { }} />
                </Panel>
                <Panel class={row}>
                    <CButton text="#show_range" flow onClick={() => { }} />
                </Panel>
            </Panel>
        )
    }
];
const collapseItem_debug: CollapseProps['items'] = [
    {
        key: 'debug',
        label: '#debug',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={row}>
                    <CButton
                        text="#script_reload"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: 'script_reload'
                                }
                            )
                        }
                    />
                    <CButton
                        text="#script_clear"
                        flow
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: 'clear'
                                }
                            )
                        }
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        toggle={true}
                        checked={Game.GetConvarBool('cl_particle_log_creates')}
                        flow
                        text="#particle_log"
                        onClick={(e: boolean) =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `cl_particle_log_creates ${e ? '1' : '0'
                                        }`
                                }
                            )
                        }
                    />
                    <CButton text="#combat_log" flow onClick={() => { }} />
                </Panel>
                
            </Panel>
        )
    }
];

const HeroReplace = () => {
    console.error('HeroReplace');
};
const HeroAddFriend = () => { };
const HeroAddEnemy = () => { };

const [arrowParticle, setArrowParticle] = createSignal<ParticleID>(
    -1 as ParticleID
);
const EntMove = () => {
    let entself = Players.GetLocalPlayerPortraitUnit();
    setArrowParticle(
        Particles.CreateParticle(
            'particles/selection/selection_grid_drag.vpcf',
            ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            entself
        )
    );
    const origin = Entities.GetAbsOrigin(entself);
    if (origin == undefined) {
        console.error('当前肖像实体无法获得位置');
        return;
    }
    origin[2] += 50;
    Particles.SetParticleControl(arrowParticle(), 4, origin);
    Particles.SetParticleAlwaysSimulate(arrowParticle());

    const think = (pos: [number, number, number]) => {
        const origin = Entities.GetAbsOrigin(entself);
        origin[2] += 50;
        Particles.SetParticleControl(arrowParticle(), 4, origin);
        Particles.SetParticleControl(arrowParticle(), 5, [
            pos[0],
            pos[1],
            pos[2]
        ]);
        Particles.SetParticleControl(arrowParticle(), 2, [128, 128, 128]);
    };

    const handleClick = (
        eventType: MouseEvent,
        button: MouseButton | MouseScrollDirection,
        pos: [number, number, number]
    ) => {
        if (eventType !== 'pressed' || button !== 0) {
            return;
        }
        Particles.DestroyParticleEffect(arrowParticle(), true);
        Particles.ReleaseParticleIndex(arrowParticle());

        GameEvents.SendCustomGameEventToServer('c2s_ent_move', {
            units: Players.GetSelectedEntities(Players.GetLocalPlayer()),
            pos: {
                x: pos[0],
                y: pos[1],
                z: pos[2]
            }
        });
        removeListener();
    };

    // 注册监听
    const removeListener = mouseManager.start(handleClick, think, 'cast');
};

export const ToolCommon = () => {
    return (
        <Layer name="tool_common" type="left" class={main}>
            <Panel class="head">
                <Label text="#tool_common" />
                <Button
                    onactivate={() => {
                        layer.close('tool_common', 'left');
                    }}
                />
            </Panel>
            <Panel class="content">
                <Collapse items={collapseItem_unit} activeKey="unit"></Collapse>
                <Collapse items={collapseItem_world} activeKey="world" ></Collapse>
                <Collapse items={collapseItem_ui} activeKey="ui"></Collapse>
                <Collapse
                    items={collapseItem_debug}
                    activeKey="debug"
                ></Collapse>
            </Panel>
        </Layer>
    );
};
