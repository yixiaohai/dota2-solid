import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

const toolcommonStyle = css`
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

    .test1 {
        flow-children: right-wrap;
    }
`;

const toolcommonRow = css`
    flow-children: right;
`;

const toolcommonHead = css`
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

const collapseItem: CollapseProps['items'] = [
    {
        key: 'hero',
        label: '#hero',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={toolcommonRow}>
                    <CButton
                        text="#resetHero"
                        flow
                        onclick={() =>
                            GameEvents.SendCustomGameEventToServer('debug_event', {
                                event: 'resetHero'
                            })
                        }
                    />
                    <CButton
                        text="#RespawnHero"
                        flow
                        onclick={() => {
                            console.log('Game.Time()');
                            const t1 = timer.create(() => {
                                console.log(`世家戳${Game.Time()},id${t1}`, 'abc');
                                if (Game.Time() < 2100) {
                                    return 1;
                                }
                            });

                            timer.create(() => {
                                console.log(`tingzhi id${t1}`);
                                timer.remove(t1);
                            }, 3);
                        }}
                    />
                    <CButton text="#ReplaceHero" flow />
                </Panel>
                <Panel class={toolcommonRow}>
                    <CButton
                        text="#SetGold"
                        color="blue"
                        flow
                        onclick={() => {
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
                <Panel class={toolcommonRow}>
                    <CButton text="#ClearInventory" flow />
                    <CButton text="#LevelUp" flow />
                    <CButton text="#MaxLevelUp" flow />
                </Panel>
                <Panel class={toolcommonRow}>
                    <CButton text="#GetAbilityPoint" color="green" flow />
                    <CButton text="#RemoveAbilityPoint" color="red" flow />
                    <CButton text="#ReplaceAbility" color="blue" flow />
                </Panel>
            </Panel>
        )
    },
    {
        key: 'unit',
        label: '#unit',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
            </Panel>
        )
    },
    {
        key: 'unit',
        label: '#unit',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
            </Panel>
        )
    },
    {
        key: 'unit',
        label: '#unit',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
            </Panel>
        )
    },
    {
        key: 'unit',
        label: '#unit',
        children: () => (
            <Panel style={{ flowChildren: 'down' }}>
                <Panel class={toolcommonRow}>
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                    <CButton text="#ResetHero" flow />
                </Panel>
                <Panel class={toolcommonRow}>
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
            name="toolcommon"
            type="left"
            onOpen={() => console.log('open')}
            onClose={() => console.log('close')}
            class={toolcommonStyle}
        >
            <Panel class={toolcommonHead}>
                <Label text="#toolCommon" />
                <Button
                    onactivate={() => {
                        layer.close('toolcommon', 'left');
                    }}
                />
            </Panel>
            <Panel class="test1">
                <Collapse items={collapseItem} activeKey="hero"></Collapse>
            </Panel>
            <Panel class="test2"></Panel>
        </Layer>
    );
};
