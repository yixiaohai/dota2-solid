// 扩展全局类型但避免冲突
declare global {
    // 步骤1：声明接口增强
    interface Console {
        /** 自定义日志方法 */
        log(...args: any[]): void;
    }

    // 步骤2：通过合并声明安全定义
    var console: Console;
}

// 步骤3：导出空对象避免成为全局模块
export {};