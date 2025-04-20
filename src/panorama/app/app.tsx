import {
    createEffect,
    createMemo,
    createSignal,
    For,
    Index,
    Match,
    onMount,
    Switch
} from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import css from 'solid-panorama-all-in-jsx/css.macro';

xml(
    <root>
        <styles>
            <include src="file://{resources}/styles/custom_game/app.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/app.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" class="root" hittest={false} />
        </Panel>
    </root>
);

css`
    .root {
        width: 100%;
        height: 100%;
    }
`;

const rootStyle = css`
    flow-children: down;
    horizontal-align: center;
    vertical-align: center;
    font-size: 20px;
    color: #ffffff;
    width: 300px;
`;

console.log('Main load');

import { ToolCommon } from '../view_debug/tool_common';
import { console } from '../utils/console';
import { default_ui } from '../components/default_ui';
import { createStore } from 'solid-js/store';



export function Main() {
    onMount(() => {
        default_ui.defaultSet();

    });



    return (
        <Panel class="root">
            <Panel class={rootStyle}>
                
            </Panel>
        </Panel>
    );
}

render(() => <Main />, $('#app'));

(() => {
    const root = $.GetContextPanel().GetParent()!.GetParent()!.GetParent()!;
    const element = root.FindChildTraverse('MenuButtons');
    if (element != null) {
        element.style.visibility = 'collapse';
    }
})();
