import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { default_ui, DefaultUIState } from '../components/default_ui';
import { createSignal, For } from 'solid-js';
import { forEach, forIn } from 'lodash';

const main = css`
    flow-children: down;
    width: 520px;
    height: 680px;
    horizontal-align: center;
    vertical-align: middle;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    opacity: 1;
    transform: translateX(0px) translateY(-100px);
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

// 初始化列表
const [items, setItems] = createSignal<DotaDefaultUIElement_t[]>([]);
// 添加示例数据
setItems([
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM,
    DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS
]);

export const DefaultUI = () => {
    return (
        <Layer
            name="default_ui"
            type="center"
            class={main}
            shade={0.8}
            shadeClose={true}
        >
            <Panel class="head">
                <Label text="#default_ui" />
                <Button
                    onactivate={() => {
                        layer.close('default_ui', 'center');
                    }}
                />
            </Panel>
            <Panel class="content">
                <For each={items()}>
                    {i => (
                        <Panel class={row}>
                            <Label text={`#default_ui_${i}`} />
                            <CButton
                                text={default_ui.get(i) ? '开启' : '关闭'}
                                color={default_ui.get(i) ? 'green' : 'grey'}
                                onactivate={() => {
                                    default_ui.set(i, !default_ui.get(i));
                                }}
                            />
                        </Panel>
                    )}
                </For>
            </Panel>
        </Layer>
    );
};
