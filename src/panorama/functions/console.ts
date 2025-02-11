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
        this.print(args, 'log');
    }

    private print(content: any, identifier?: string, level?: number): void {
        level = level || 0;
        let tempStr = '';
        if (level > 0) {
            for (let index = 0; index < level; index++) {
                tempStr += '\t';
            }
        }
        if (identifier) {
            identifier = identifier + ' : ';
        } else {
            identifier = '';
        }
        if (typeof content == 'object') {
            $.Msg(tempStr + identifier + '{');
            for (let i in content) {
                let v = content[i];
                if (typeof v === 'object') {
                    this.print(v, i, level + 1);
                } else {
                    $.Msg(
                        tempStr +
                            '\t' +
                            i.padEnd(20) +
                            ' = ' +
                            v +
                            ' (' +
                            typeof v +
                            ')'
                    );
                }
            }
            $.Msg(tempStr + '}');
        } else {
            $.Msg(tempStr + identifier + content);
        }
    }
}

globalThis.console = PanoramaConsole.getInstance();
