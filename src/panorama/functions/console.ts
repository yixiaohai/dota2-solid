// 步骤3：导出空对象避免成为全局模块
export {};

class PanoramaConsole {
    private static instance: PanoramaConsole;

    private constructor() {
        // 初始化逻辑
    }

    static getInstance(): PanoramaConsole {
        if (!this.instance) {
            this.instance = new PanoramaConsole();
        }
        return this.instance;
    }

    log(...args: any[]): void {
        $.Msg('[log]', ...args.map(this.stringify));
    }

    private stringify(arg: any): string {
        try {
            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
        } catch {
            return '[Circular]';
        }
    }
}

globalThis.console = PanoramaConsole.getInstance();
