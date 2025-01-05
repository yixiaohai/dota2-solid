import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import css from 'solid-panorama-all-in-jsx/css.macro';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import { render } from 'solid-panorama-runtime';
import { Menu, MenuItem } from '../components/menu';

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
            <Panel id="app_debug" class="root" hittest={false}/>
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

    const [menuShow, setMenuShow] = createSignal(false)
    const [menuItem, setMenuItem] = createStore<MenuItem[]>([
        {
            icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png',
            func: () => {
                console.log('toolcommon');
            },
            key: 'toolcommon',
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
            },
            key: 'tooldeveloper',
            label: '开发工具',
            style: {
                width: '24px',
                height: '24px'
            }
        },
    ]);

    onMount(() => {
        console.log('Created Debug View');
        setInterval(() => {
            setMenuShow(true);
        }, 1500);
    });

    return (
        <Panel class='root'>
            <Menu items={menuItem} mode="horizontal" show={menuShow()} />
        </Panel>
    );
}

render(() => <Debug />, $('#app_debug'));
