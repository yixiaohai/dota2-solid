const global = globalThis as typeof globalThis & {
    reloadCache: Record<string, any>;
};
if (global.reloadCache === undefined) {
    global.reloadCache = {};
}

export function reloadable<T extends { new (...args: any[]): {} }>(constructor: T): T {
    print(`[@reloadable] Applying to class: ${constructor.name}`); // 添加日志)
    DeepPrintTable(constructor); // 添加日志)
    const className = constructor.name;
    if (global.reloadCache[className] === undefined) {
        global.reloadCache[className] = constructor;
    }

    Object.assign(global.reloadCache[className].prototype, constructor.prototype);
    return global.reloadCache[className];
}
