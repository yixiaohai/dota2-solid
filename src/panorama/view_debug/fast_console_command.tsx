import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { createSignal, For } from 'solid-js';
import { forEach, forIn } from 'lodash';

const main = css`
    flow-children: down;
    width: 520px;
    height: 950px;
    horizontal-align: center;
    vertical-align: top;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    opacity: 1;
    transform: translateX(0px) translateY(80px);
    transition-property: opacity, pre-transform-scale2d;
    transition-duration: 0.3s;
    transition-timing-function: ease-in;

    .minimized & {
        opacity: 0;
        pre-transform-scale2d: 0.85;
    }

    .content {
        width: 100%;
        flow-children: down;
        padding: 10px;
    }
`;

const row = css`
    width: 100%;
    flow-children: right;
    padding: 10px;
    margin-bottom: 10px;
    background-color: rgba(255, 255, 255, 0.05);
    transition: background-color 0.3s ease 0s;

    &:hover {
        background-color: rgba(255, 255, 255, 0.15);
    }

    & > Label {
        width: 420px;
        line-height: 30px;
        color: #fff;
    }
`;

interface CommandState {
    name: string;
    value: boolean;
}

// 初始化列表
const [boolItems, setBoolItems] = createSignal<CommandState[]>([]);
const [commandItems, setCommandItems] = createSignal<string[]>([]);
// 添加示例数据
setBoolItems([
    { name: "dota_easybuy", value: false },
    { name: "cl_dota_gridnav_show", value: false },
    { name: "dota_unit_show_bounding_radius", value: false },
    { name: "dota_unit_show_selection_boxes", value: false },
    { name: "dota_unit_show_collision_radius", value: false },
    { name: "debug_overlay_fullposition", value: false },
    { name: "dota_combine_models", value: false },
    { name: "showtriggers", value: false },
    { name: "r_freezeparticles", value: false },
    { name: "cl_particle_log_creates", value: false },
    { name: "fog_enable", value: false },
    
]);

setCommandItems([
    'cl_entitysummary',
]);

setBoolItems(prevData =>
    prevData.map(l => {
        return { ...l, value: Game.GetConvarBool(l.name) };
    })
);

export const FastConsoleCommand = () => {
    return (
        <Layer
            name="fast_console_command"
            type="center"
            class={main}
            shade={0.8}
            shadeClose={true}
        >
            <Panel class="head">
                <Label text="#fast_console_command" />
                <Button
                    onactivate={() => {
                        layer.close('fast_console_command', 'center');
                    }}
                />
            </Panel>
            <Panel class="content">
                <For each={boolItems()}>
                    {i => (
                        <Panel class={row}>
                            <Label text={`#${i.name}`} />
                            <CButton
                                text={i.value ? '开启' : '关闭'}
                                color={i.value ? 'green' : 'grey'}
                                onactivate={() => {
                                    setBoolItems(prevData =>
                                        prevData.map(l => {
                                            if (l.name === i.name) {
                                                return { ...l, value: !i.value };
                                            }
                                            return l;
                                        })
                                    );
                                    GameEvents.SendCustomGameEventToServer(
                                        'c2s_console_command',
                                        {
                                            command: `${i.name} ${i.value ? '0' : '1'}`
                                        }
                                    )
                                }}
                            />
                        </Panel>
                    )}
                </For>
                <For each={commandItems()}>
                    {i => (
                        <Panel class={row}>
                            <Label text={`#${i}`} />
                            <CButton
                                text="发送"
                                color="cyan"
                                onactivate={() => {
                                    GameEvents.SendCustomGameEventToServer(
                                        'c2s_console_command',
                                        {
                                            command: `${i}`
                                        }
                                    )
                                }}
                            />
                        </Panel>
                    )}
                </For>
            </Panel>
        </Layer>
    );
};
