import { createEffect, createSignal, Match, onMount, Switch } from 'solid-js';
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
    vertical-align: bottom;
`;

console.log('Main load');

import { Shop } from '../view/shop';
import { Lowhud } from '../view/lowhud';
import { ToolCommon } from '../view_debug/tool_common';
import { console } from '../utils/console';
import { default_ui } from '../components/default_ui';

export function Main() {
    const [count, setCount] = createSignal(0);

    createEffect(() => {
        console.log(`当前计数: ${count()}`);
    });

    onMount(() => {
        default_ui.defaultSet();
        console.log('Created Main3', rootStyle);
    });

    return (
        <Panel class={rootStyle}>
            <Button onactivate={() => setCount(count() + 1)}>
                <Label text={`增加:${count()}`} tooltip_text="123123" />
            </Button>
            <Switch>
                <Match when={count() === 1}>
                    <Shop />
                </Match>
                <Match when={count() === 2}>
                    <Lowhud />
                </Match>
            </Switch>
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
