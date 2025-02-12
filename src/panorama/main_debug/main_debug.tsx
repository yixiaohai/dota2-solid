import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import css from 'solid-panorama-all-in-jsx/css.macro';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import { render } from 'solid-panorama-runtime';
import { Menu, MenuItem } from '../components/menu';
import { layer } from '../components/layer/manager';
import { ToolCommon } from '../view_debug/toolcommon';
import { ToolDeveloper } from '../view_debug/tooldeveloper';
import { console } from '../functions/console';

css`
    .root {
        width: 100%;
        height: 100%;
    }
`;

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/main_debug.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/main_debug.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app_debug" class="root" hittest={false} />
        </Panel>
    </root>
);

const rootStyle = css`
    flow-children: down;
    horizontal-align: center;
    vertical-align: bottom;
    margin-bottom: 500px;
`;

export function Debug() {
    if (!Game.IsInToolsMode()) {
        return;
    }

    const [menuShow, setMenuShow] = createSignal(false);
    const [menuItem, setMenuItem] = createStore<MenuItem[]>([
        {
            icon: 's2r://panorama/images/control_icons/return_to_game_png.vtex',
            onclick: () => {
                $.DispatchEvent('DOTAHUDShowDashboard');
            },
            label: '返回主界面',
            style: {
                width: '30px',
                height: '30px',
                transform: 'scaleY(-1)'
            }
        },
        {
            icon: 's2r://panorama/images/control_icons/gear_png.vtex',
            onclick: () => {
                $.DispatchEvent('DOTAShowSettingsPopup');
            },
            label: '设置',
            style: {
                width: '26px',
                height: '26px'
            }
        },
        {
            icon: 's2r://panorama/images/control_icons/hamburger_png.vtex',
            onclick: () => {
                $.DispatchEvent('DOTAHUDToggleScoreboard');
            },
            label: '计分板',
            style: {
                width: '27px',
                height: '27px'
            },
            show: false
        },
        {
            icon: 's2r://panorama/images/control_icons/24px/tool.vsvg',
            onclick: () => {
                layer.toggle('toolcommon', 'left');
            },
            label: '通用工具',
            style: {
                width: '24px',
                height: '24px'
            }
        },
        {
            icon: 's2r://panorama/images/control_icons/24px/debut_tool.vsvg',
            onclick: () => {
                layer.toggle('tooldeveloper', 'left');
            },
            label: '开发工具',
            style: {
                width: '24px',
                height: '24px'
            }
        }
    ]);

    onMount(() => {
        console.log('Created Debug View');
        // setTimeout(() => {
        //     setMenuShow(true);
        // }, 1500);
        setMenuShow(true);
    });

    return (
        <Panel class="root">
            <Menu items={menuItem} show={menuShow()} />
            <ToolCommon />
            <ToolDeveloper />
        </Panel>
    );
}

render(() => <Debug />, $('#app_debug'));
