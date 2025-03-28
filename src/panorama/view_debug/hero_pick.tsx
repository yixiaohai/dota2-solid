import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { createSignal, For, onMount } from 'solid-js';
import { forEach, forIn, set } from 'lodash';
import { createStore } from 'solid-js/store';

const main = css`
    flow-children: down;
    width: 1000px;
    height: 950px;
    horizontal-align: left;
    vertical-align: top;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    opacity: 1;
    transform: translateX(310px) translateY(50px);
    transition-property: opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-in;

    .minimized & {
        opacity: 0;
        transform: translateX(0px) translateY(50px);
    }

    .content {
        width: 100%;
        flow-children: down;
        padding: 10px;
    }
`;

type nativeHeroKVType = {
    hero_name: string;
    Facets: any;
};

const [nativeHeroKV, setNativeHeroKV] = createStore<nativeHeroKVType[]>([]);

export const HeroPick = () => {
    return (
        <Layer
            name="hero_pick"
            type="center"
            class={main}
            shade={0.8}
            shadeClose={true}
        >
            <Panel class="head">
                <Label text="#hero_pick" />
                <CButton
                    class="button"
                    onactivate={() => {
                        layer.close('hero_pick', 'center');
                    }}
                />
            </Panel>
            <Panel class="content">
                <For each={nativeHeroKV}>
                    {(item, index) => (
                        <Panel style={{ flowChildren: 'right' }}>
                            <Label text={item.hero_name} />
                            <Label text={item.Facets} />
                        </Panel>
                    )}
                </For>
            </Panel>
        </Layer>
    );
};

onMount(() => {
    GameEvents.SendCustomGameEventToServer('c2s_event', {
        event: 'get_native_hero_kv'
    });

    const s2c_native_hero_kv = GameEvents.Subscribe(
        's2c_native_hero_kv',
        data => {
            const kv = data.kv;
            const updatedHeroKV: nativeHeroKVType[] = [];

            forIn(kv, (value, _) => {
                const data = value as nativeHeroKVType;
                updatedHeroKV.push(data);
            });

            // 更新状态，传递完整的新数组
            setNativeHeroKV(updatedHeroKV);
            GameEvents.Unsubscribe(s2c_native_hero_kv);
        }
    );
});
