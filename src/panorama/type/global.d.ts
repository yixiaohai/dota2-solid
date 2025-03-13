interface CDOTA_PanoramaScript_GameUI {
    __modules: { [key: string]: any }; // 定义 __modules 属性
    __loadModule: (name: string, exports?: any) => void; // 定义 __loadModule 方法
    __require: (name: string) => any; // 定义 __require 方法
}

interface CScriptBindingPR_Game {
    GetConvarBool: (name: string) => boolean;
    GetConvarInt: (name: string) => number;
    GetConvarFloat: (name: string) => number;
}
