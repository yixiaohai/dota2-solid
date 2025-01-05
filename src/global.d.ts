/// <reference path="../node_modules/solid-panorama-polyfill/console.d.ts" />
/// <reference path="../node_modules/solid-panorama-polyfill/timers.d.ts" />

interface CustomGameEventDeclarations {
    custom_event_test: { test: number };
}

declare function useTimer(
    firstDelay: number,
    callback: () => number | undefined,
    deps?: any
): void;
declare function useTimer(callback: () => number | undefined, deps?: any): void;

interface CustomNetTableDeclarations {
    test: {};
}

interface CDOTA_PanoramaScript_GameUI {
    __modules: { [key: string]: any }; // 定义 __modules 属性
    __loadModule: (name: string, exports?: any) => void; // 定义 __loadModule 方法
    __require: (name: string) => any; // 定义 __require 方法
    __layer: { [key: string]: any}
}

interface ModuleExports {
    [key: string]: any; // 根据需要定义更具体的类型
}

