import { createStore } from 'solid-js/store';
import { console } from '../../functions/console';
import { createSignal, onCleanup, onMount } from 'solid-js';

export type DefaultUIState = Record<DotaDefaultUIElement_t, boolean>;

const [defaultUIData, setDefaultUIData] = createStore<DefaultUIState>(
    {} as DefaultUIState
);

const [cameraDistance, setCameraDistance] = createSignal<number | null>(null);

const set = (name: DotaDefaultUIElement_t, state: boolean) => {
    GameUI.SetDefaultUIEnabled(name, state);
    setDefaultUIData(name, state);
};

const get = (name: DotaDefaultUIElement_t) => {
    return defaultUIData[name] ?? undefined;
};

const camera_distance_set = (height: number) => {
    setCameraDistance(height);
};

const camera_distance_get = () => {
    return cameraDistance()
};


const defaultSet = () => {
    GameUI.SetCameraDistance(1200)
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false); // 击杀助攻数据
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false); // 顶部
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false); // 左侧默认计分板
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false); // 小地图
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false); // 下方动态头像和技能面板
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false); // 商店
    set(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM, false); //击杀者提示
    set(
        DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS,
        true
    ); //自定义UI是否在默认UI之上
};

interface DefaultUIActions {
    set: (name: DotaDefaultUIElement_t, state: boolean) => void;
    get: (name: DotaDefaultUIElement_t) => boolean | undefined;
    defaultSet: () => void;
    camera_distance_set: (height: number) => void;
    camera_distance_get: () => number | null;
}

export const default_ui: DefaultUIActions = {
    get,
    set,
    defaultSet,
    camera_distance_set,
    camera_distance_get,
};

onMount(() => {
    GameEvents.SendCustomGameEventToServer(
        'c2s_event',
        {
            event: 'get_camera_distance'
        }
    )

    const s2c_camera_distance = GameEvents.Subscribe('s2c_camera_distance', (data) => {
        default_ui.camera_distance_set(data.distance)
        GameEvents.Unsubscribe(s2c_camera_distance);
    })

});
