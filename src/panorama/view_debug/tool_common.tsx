import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { create } from 'lodash';
import { createSignal, onMount } from 'solid-js';
import { cursor } from '../components/cursor';
import { default_ui } from '../components/default_ui';

const main = css`
    flow-children: down;
    width: 300px;
    max-height: 1000px;
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
        overflow: squish scroll;
    }
`;

const row = css`
    flow-children: right;
`;

const row_rune = css`
    margin-top: 10px;
    flow-children: right;
    Button {
        width: fill-parent-flow(1);
    }
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
                        onactivate={() =>
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
                    <CButton
                        text="#hero_replace"
                        flow
                        color="blue"
                        onactivate={HeroReplace}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#level_up"
                        flow
                        onactivate={() =>
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
                        onactivate={() =>
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
                        onactivate={() =>
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
                        icon="s2r://panorama/images/hud/sprout_icon_psd.vtex"
                        onactivate={() =>
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
                        text="#ent_remove"
                        tooltip_text="#ent_remove_desc"
                        flow
                        onactivate={() =>
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
                    <CButton
                        text="#ent_move"
                        flow
                        color="purple"
                        onactivate={EntMove}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#dummy_add"
                        flow
                        onactivate={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_event',
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
                        onactivate={HeroAddFriend}
                    />
                    <CButton
                        text="#hero_add_enemy"
                        color="red"
                        flow
                        onactivate={HeroAddEnemy}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#ent_info"
                        flow
                        color="blue"
                        onactivate={() =>
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
                        color="blue"
                        onactivate={() =>
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
                        color="blue"
                        onactivate={() =>
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
                        color="blue"
                        onactivate={() =>
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
                        color="blue"
                        onactivate={() =>
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
                        color="blue"
                        onactivate={() =>
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
                        toggle={true}
                        checked={allMapVision()}
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_check_event',
                                {
                                    event: 'all_map_vision',
                                    checked: !allMapVision()
                                }
                            );
                        }}
                    />
                    <CButton
                        text="#free_spells"
                        flow
                        toggle={true}
                        checked={Game.GetConvarBool('dota_ability_debug')}
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_unit_event',
                                {
                                    event: 'refresh',
                                    units: Players.GetSelectedEntities(
                                        Players.GetLocalPlayer()
                                    )
                                }
                            );
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `dota_ability_debug ${
                                        Game.GetConvarBool('dota_ability_debug')
                                            ? '0'
                                            : '1'
                                    }`
                                }
                            );
                        }}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#day_night_cycle"
                        flow
                        onactivate={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_event',
                                {
                                    event: 'day_night_cycle'
                                }
                            )
                        }
                    />
                    <CButton
                        text="#host_timescale"
                        flow
                        color="blue"
                        onactivate={() => {
                            dialog.open({
                                title: '#host_timescale',
                                describe: '#host_timescale_desc',
                                input: true,
                                currentValue:
                                    Game.GetConvarFloat(
                                        'host_timescale'
                                    ).toString(),
                                defaultValue: '1',
                                shadeClose: true,
                                slider: true,
                                max: 10,
                                onOk: (v: string) =>
                                    GameEvents.SendCustomGameEventToServer(
                                        'c2s_console_command',
                                        {
                                            command: `host_timescale ${v}`
                                        }
                                    )
                            });
                        }}
                    />
                </Panel>
                <Panel class={row_rune}>
                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `DOUBLEDAMAGE`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_DoubleDamage');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonDoubleDamage"
                            alias="doubledamage"
                            animating={false}
                        />
                    </Button>
                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `HASTE`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Haste');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonHaste"
                            alias="haste"
                            animating={false}
                        />
                    </Button>
                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `ILLUSION`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Illusion');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonIllusion"
                            alias="illusion"
                            animating={false}
                        />
                    </Button>
                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `INVISIBILITY`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Invisibility');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonInvisibility"
                            alias="invisibility"
                            animating={false}
                        />
                    </Button>
                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `REGENERATION`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Regeneration');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonRegeneration"
                            alias="regeneration"
                            animating={false}
                        />
                    </Button>

                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `ARCANE`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Arcane');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonArcane"
                            alias="arcane_rune"
                            animating={false}
                        />
                    </Button>

                    <Button
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_rune_event',
                                {
                                    type: `SHIELD`
                                }
                            );
                        }}
                        onmouseover={e => {
                            MouseOverRune(e, '#DOTA_HUD_Rune_Shield');
                        }}
                        onmouseout={e => {
                            MouseOutRune(e);
                        }}
                    >
                        <DOTAEmoticon
                            id="RuneEmoticonShield"
                            alias="shield_rune"
                            animating={false}
                        />
                    </Button>
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
                        color="blue"
                        onactivate={() => {
                            layer.toggle('default_ui', 'center');
                        }}
                    />
                    <CButton
                        text="#combat_log"
                        flow
                        color="blue"
                        onactivate={() => {
                            $.DispatchEvent('DOTAHUDToggleCombatLog');
                        }}
                    />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#show_range"
                        flow
                        color="blue"
                        onactivate={() => {
                            dialog.open({
                                title: '#show_range',
                                describe: '#show_range_desc',
                                input: true,
                                currentValue:
                                    Game.GetConvarFloat(
                                        'dota_range_display'
                                    ).toString(),
                                defaultValue: '0',
                                shadeClose: true,
                                slider: true,
                                max: 3000,
                                min: 0,
                                onOk: (v: string) => {
                                    const value = Number(v);
                                    GameEvents.SendCustomGameEventToServer(
                                        'c2s_console_command',
                                        {
                                            command: `dota_range_display ${value}`
                                        }
                                    );
                                }
                            });
                        }}
                    />
                    <CButton
                        text="#camera_adjust"
                        flow
                        color="blue"
                        onactivate={() => {
                            layer.toggle('camera_adjust', 'right');
                        }}
                    />
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
                        onactivate={() =>
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
                        onactivate={() =>
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
                        text="#game_restart"
                        flow
                        onactivate={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: 'restart'
                                }
                            )
                        }
                    />
                    <CButton
                        text="#fast_console_command"
                        flow
                        color="blue"
                        onactivate={() =>
                            layer.toggle('fast_console_command', 'center')
                        }
                    />
                </Panel>
            </Panel>
        )
    }
];

const MouseOverRune = (ButtonPanle: Panel, strRuneTooltip: string) => {
    const runePanel = ButtonPanle.GetChild(0) as AnimatedImageStrip;
    if (!runePanel) return;

    runePanel.StartAnimating();
    $.DispatchEvent('UIShowTextTooltip', runePanel, strRuneTooltip);
};

const MouseOutRune = (ButtonPanle: Panel) => {
    const runePanel = ButtonPanle.GetChild(0) as AnimatedImageStrip;
    if (!runePanel) return;
    runePanel.StopAnimating();
    $.DispatchEvent('UIHideTextTooltip', runePanel);
};

const HeroReplace = () => {
    console.warn('HeroReplace');
    GameEvents.SendCustomGameEventToServer('c2s_event', {
        event: 'test'
    });
};
const HeroAddFriend = () => {};
const HeroAddEnemy = () => {};

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
        pos: [number, number, number] | null
    ) => {
        if (eventType !== 'pressed' || button !== 0 || !pos) {
            return;
        }
        Particles.DestroyParticleEffect(arrowParticle(), true);
        Particles.ReleaseParticleIndex(arrowParticle());

        const pid = Particles.CreateParticle(
            'particles/items_fx/blink_dagger_start.vpcf',
            ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            entself
        );
        Particles.DestroyParticleEffect(pid, false);
        Particles.ReleaseParticleIndex(pid);

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
    const removeListener = cursor.start(handleClick, think, 'cast');
};

export const ToolCommon = () => {
    return (
        <Layer name="tool_common" type="left" class={main}>
            <Panel class="head">
                <Label text="#tool_common" />
                <CButton
                    class="button"
                    onactivate={() => {
                        layer.close('tool_common', 'left');
                    }}
                />
            </Panel>
            <Panel class="content">
                <Collapse items={collapseItem_unit} activeKey="unit"></Collapse>
                <Collapse
                    items={collapseItem_world}
                    activeKey="world"
                ></Collapse>
                <Collapse items={collapseItem_ui} activeKey="ui"></Collapse>
                <Collapse
                    items={collapseItem_debug}
                    activeKey="debug"
                ></Collapse>
            </Panel>
        </Layer>
    );
};

const [allMapVision, setAllMapVision] = createSignal(false);

onMount(() => {
    GameEvents.Subscribe('s2c_all_map_vision_state', data => {
        console.warn(data);
        setAllMapVision(data.checked == 1 ? true : false);
    });
});
