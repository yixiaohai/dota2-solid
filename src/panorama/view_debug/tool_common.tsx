import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

const main = css`
    flow-children: down;
    width: 520px;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    transform: translateX(0px) translateY(60px);
    opacity: 1;
    transition-property: opacity, transform;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;

    .minimized & {
        opacity: 0;
        transform: translateX(-520px) translateY(60px);
    }

    .content {
        flow-children: down;
    }
`;

const row = css`
    flow-children: right;
`;

const head = css`
    width: 100%;
    background-color: #181818;
    border-bottom: 2px solid #111111;

    Label {
        font-size: 18px;
        color: #666666;
        margin: 6px;
    }

    Button {
        width: 24px;
        height: 24px;
        wash-color: #888888;
        horizontal-align: right;
        background-image: url('s2r://panorama/images/control_icons/x_close_grey_psd.vtex');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: 50% 50%;
        margin: 4px;
        transition-property: wash-color, pre-transform-scale2d, background-color;
        transition-duration: 0.1s;
        transition-timing-function: ease-in;
    }

    Button:hover {
        wash-color: #fff;
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
                        onClick={() =>
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_hero_reset',
                                {}
                            )
                        }
                    />
                    <CButton
                        text="#RespawnHero"
                        flow
                        onClick={() => {
                            console.log('Game.Time()');
                            const t1 = timer.create(() => {
                                console.log(
                                    `当前时间${Game.Time()},id${t1}`,
                                    'abc'
                                );
                                return 1;
                            });

                            timer.create(() => {
                                console.log(`tingzhi id${t1}`);
                                timer.remove(t1);
                            }, 10);
                        }}
                    />
                    <CButton text="#ReplaceHero" flow onClick={() => {}} />
                </Panel>
                <Panel class={row}>
                    <CButton
                        text="#SetGold"
                        color="blue"
                        flow
                        onClick={() => {
                            dialog.open({
                                title: '确认删除',
                                describe: '您确定要删除此项目吗？',
                                input: true,
                                inputBig: true,
                                onOk: () => console.log('确认删除')
                            });
                        }}
                    />
                    <CButton text="#AddHero_Friend" color="green" flow />
                    <CButton text="#AddHero_Enemy" color="red" flow />
                </Panel>
                <Panel class={row}>
                    <CButton text="#ClearInventory" flow />
                    <CButton text="#LevelUp" flow />
                    <CButton text="#MaxLevelUp" flow />
                </Panel>
                <Panel class={row}>
                    <CButton text="#GetAbilityPoint" color="green" flow />
                    <CButton text="#RemoveAbilityPoint" color="red" flow />
                    <CButton text="#ReplaceAbility" color="blue" flow />
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
                                'c2s_script_reload',
                                {}
                            )
                        }
                    />
                    <CButton text="#default_UI" flow onClick={() => { layer.toggle('default_ui', 'center') }} />
                    <CButton text="#ResetHero" flow />
                </Panel>
                <Panel class={row}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
            </Panel>
        )
    }
];

export const ToolCommon = () => {
    return (
        <Layer
            name="tool_common"
            type="left"
            class={main}
        >
            <Panel class={head}>
                <Label text="#tool_common" />
                <Button
                    onactivate={() => {
                        layer.close('tool_common', 'left');
                    }}
                />
            </Panel>
            <Panel class="content">
                <Collapse items={collapseItem_unit} activeKey="unit"></Collapse>
                <Collapse items={collapseItem_debug} activeKey="debug"></Collapse>
            </Panel>
        </Layer>
    );
};
