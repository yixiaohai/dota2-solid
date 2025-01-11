import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import css from 'solid-panorama-all-in-jsx/css.macro';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import { render } from 'solid-panorama-runtime';
import { Menu, MenuItem } from '../components/menu';
import { Layer } from '../components/layer';
import { Test } from '../view_debug/test';
import { Test2 } from '../view_debug/test2';

css`
    .root {
        width: 100%;
        height: 100%;
    }
`;

xml(
    <root>
        <styles>
            <include src="file://{resources}/styles/custom_game/main_debug.css" />
            <include src="file://{resources}/styles/custom_game/precache.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
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

    const layer = GameUI.__layer;
    

    const [menuShow, setMenuShow] = createSignal(false);
    const [menuItem, setMenuItem] = createStore<MenuItem[]>([
        {
            icon: 's2r://panorama/images/control_icons/return_to_game_png.vtex',
            func: () => {
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
            func: () => {
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
            func: () => {
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
            icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png',
            func: () => {
                console.log('toolcommon');
                layer.open('toolcommon', 'a');
            },
            label: '通用工具',
            style: {
                width: '24px',
                height: '24px'
            }
        },
        {
            icon: 'file://{resources}/images/custom_game/debug/icon/toolDeveloper.png',
            func: () => {
                console.log('tooldeveloper');
                layer.open('tooldeveloper', 'a');
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
        setInterval(() => {
            setMenuShow(true);
        }, 1500);
    });

    return (
        <Panel class="root">
            <Menu items={menuItem} show={menuShow()} />
            <Layer name='toolcommon' type='a'>
                <Test />
            </Layer>
            <Layer name='tooldeveloper' type='a'>
                <Test2 />
            </Layer>
        </Panel>
    );
}

render(() => <Debug />, $('#app_debug'));
