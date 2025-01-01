import { onMount } from 'solid-js';
import { render } from 'solid-panorama-runtime';
import xml from 'solid-panorama-all-in-jsx/xml.macro';
import css from 'solid-panorama-all-in-jsx/css.macro';
import default_ui_config from '../functions/default_ui_config';

default_ui_config();

xml(
    <root>
        <styles>
            <include src="file://{resources}/styles/custom_game/main.css" />
        </styles>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
            <include src="file://{resources}/scripts/custom_game/main.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" class="root" />
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

import { DotaAbilities } from '../components/Ability';
import { Shop } from '../view/shop';

export function Main() {
    let root: Panel | undefined;

    onMount(() => {
        console.log('Created Main', rootStyle);
    });

    return (
        <Panel ref={root} class={rootStyle}>
            <Label text="test123" />
            <DotaAbilities />
            <Shop />
        </Panel>
    );
}

render(() => <Main />, $('#app'));
