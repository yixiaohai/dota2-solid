import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { createSignal, For, onMount, Show } from 'solid-js';
import { forEach, forIn, set } from 'lodash';
import { createStore } from 'solid-js/store';

const main = css`
    flow-children: down;
    width: 1170px;
    height: 1000px;
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
        flow-children: right-wrap;
        padding: 5px;
        overflow: scroll;
    }

    .hero_sigle {
        width: 164px;
        flow-children: down;
    }

    .hero_sigle_image {
        width: 160px;
        height: 90px;
        margin: 2px;
    }

    .facet_icon_wrap {
        flow-children: right;
    }

    .facet_icon_container {
        width: fill-parent-flow(1);
        height: 32px;
        margin: 2px;
    }

    .facet_icon_background {
        width: 100%;
        height: 100%;
    }

    .facet_icon_content {
        width: 100%;
        height: 100%;
    }

    .facet_icon {
        width: 20px;
        height: 20px;
        vertical-align: center;
        horizontal-align: center;
    }
`;

type nativeHeroKVType = {
    hero_name: string;
    Facets: any;
    HeroOrderID: number;
    AttributePrimary: number;
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
                <For each={nativeHeroKV.filter(item => item.AttributePrimary == 0)}>
                    {(item, index) => (
                        <Panel class="hero_sigle">
                            <Image
                                src={`${
                                    item.hero_name ==
                                    'npc_dota_hero_target_dummy'
                                        ? `s2r://panorama/images/custom_game/heroes/${item.hero_name}_png.png`
                                        : `s2r://panorama/images/heroes/${item.hero_name}_png.vtex`
                                }`}
                                class="hero_sigle_image"
                                tooltip_text={`#${item.hero_name}`}
                            />
                            <Panel class={`facet_icon_wrap`}>
                                <Show
                                    when={Object.keys(item.Facets).length > 0}
                                    fallback={<CButton text="无命石" flow />}
                                >
                                    <For each={Object.keys(item.Facets)}>
                                        {key => (
                                            <Panel
                                                class={`facet_icon_container facet_gradient_${item.Facets[
                                                    key
                                                ].Color.toLowerCase()}_${
                                                    item.Facets[key].GradientID
                                                }`}
                                            >
                                                <Panel class="facet_icon_background FacetBackground" />
                                                <Panel class="facet_icon_content">
                                                    <Image
                                                        class="facet_icon"
                                                        src={`s2r://panorama/images/hud/facets/icons/${item.Facets[key].Icon}_png.vtex`}
                                                    />
                                                </Panel>
                                            </Panel>
                                        )}
                                    </For>
                                </Show>
                            </Panel>
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
            console.warn(kv);
            const updatedHeroKV: nativeHeroKVType[] = [];

            forIn(kv, (value, _) => {
                const data = value as nativeHeroKVType;
                updatedHeroKV.push(data);
            });

            updatedHeroKV.sort(
                (a, b) => (a.HeroOrderID || 0) - (b.HeroOrderID || 0)
            );

            // 更新状态，传递完整的新数组
            setNativeHeroKV(updatedHeroKV);
            GameEvents.Unsubscribe(s2c_native_hero_kv);
        }
    );
});
