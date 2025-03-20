import { onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { DotaAbilities } from '../components/Ability';
import Inventory from '../components/Inventory';
import { console } from '../utils/console';


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

console.log('Lowhud load')

export function Lowhud() {
    let root: Panel | undefined;

    onMount(() => {
        console.log('Created lowhud', rootStyle);
    });

    return (
        <Panel ref={root} class={rootStyle}>
            <Inventory />
            <DotaAbilities />
        </Panel>
    );
}
