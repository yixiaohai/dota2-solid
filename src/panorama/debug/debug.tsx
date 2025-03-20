import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import css from 'solid-panorama-all-in-jsx/css.macro';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import { render } from 'solid-panorama-runtime';
import { Menu, MenuItem } from '../components/menu';
import { layer } from '../components/layer/manager';
import { ToolCommon } from '../view_debug/tool_common';
import { console } from '../utils/console';
import { DefaultUI } from '../view_debug/default_ui';
import { FastConsoleCommand } from '../view_debug/fast_console_command';


css`
    .root {
        width: 100%;
        height: 100%;
    }

    .head {
        width: 100%;
        background-color: #181818;
        border-bottom: 2px solid #111111;
    }

    .head Label {
        font-size: 18px;
        color: #666666;
        margin: 6px;
    }

    .head Button {
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

    .head Button:hover {
        wash-color: #fff;
    }
`;

xml(
    <root>
        <styles>
            <include src="s2r://panorama/styles/dotastyles.vcss_c" />
            <include src="file://{resources}/styles/custom_game/debug.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/debug.js" />
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
    // if (!Game.IsInToolsMode()) {
    //     return;
    // }

    const [menuShow, setMenuShow] = createSignal(false);
    const [menuItem, setMenuItem] = createStore<MenuItem[]>([
        {
            icon: 's2r://panorama/images/control_icons/return_to_game_png.vtex',
            onClick: () => {
                $.DispatchEvent('DOTAHUDShowDashboard');
            },
            label: '#backToDashboard',
            style: {
                width: '30px',
                height: '30px',
                transform: 'scaleY(-1)'
            }
        },
        {
            icon: 's2r://panorama/images/control_icons/gear_png.vtex',
            onClick: () => {
                $.DispatchEvent('DOTAShowSettingsPopup');
            },
            label: '#settings',
            style: {
                width: '26px',
                height: '26px'
            }
        },
        {
            icon: 's2r://panorama/images/control_icons/24px/debut_tool.vsvg',
            onClick: () => {
                layer.toggle('tool_common', 'left');
            },
            label: '#tool_common',
            style: {
                width: '24px',
                height: '24px'
            }
        }
    ]);

    onMount(() => {
        setMenuShow(true);
    });

    return (
        <Panel class="root">
            <Menu items={menuItem} show={menuShow()} />
            <ToolCommon />
            <DefaultUI />
            <FastConsoleCommand />
        </Panel>
    );
}

render(() => <Debug />, $('#app_debug'));
