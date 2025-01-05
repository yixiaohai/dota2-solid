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
            <Panel id="app" class="root" />
        </Panel>
    </root>
);

export function Debug() {
    if (!Game.IsInToolsMode()) {
        return;
    }

    const [menuItem, setMenuItem] = createStore<MenuItem[]>([
        {
            icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png',
            func: () => {
                console.log('toolcommon');
            },
            key: 'toolcommon',
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
            style: {
                width: '28px',
                height: '28px'
            }
        },
    ]);

    onMount(() => {
        console.log('Created Debug View');
    });

    return (
        <Panel>
            <Menu items={menuItem} mode="horizontal" />
            <Image src="s2r://panorama/images/custom_game/debug/icon/toolCommon.png.vtex" />
        </Panel>
    );
}

render(() => <Debug />, $('#app'));
