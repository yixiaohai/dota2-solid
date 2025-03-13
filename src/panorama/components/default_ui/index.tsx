import { createStore } from 'solid-js/store';
import { console } from '../../functions/console';

export type DefaultUIState = Record<DotaDefaultUIElement_t, boolean>;

const [defaultUIData, setDefaultUIData] = createStore<DefaultUIState>(
    {} as DefaultUIState
);

const set = (name: DotaDefaultUIElement_t, state: boolean) => {
    GameUI.SetDefaultUIEnabled(name, state);
    setDefaultUIData(name, state);
};

const get = (name: DotaDefaultUIElement_t) => {
    return defaultUIData[name] ?? undefined;
};


const defaultSet = () => {
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
}

export const default_ui: DefaultUIActions = {
    get,
    set,
    defaultSet
};
