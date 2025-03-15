interface console {
    log(...args: any[]): void;
    error(...args: any[]): void;
}

class VscriptConsole implements console {
    private static instance: VscriptConsole;

    private constructor() {
        // 初始化逻辑
    }

    static getInstance(): VscriptConsole {
        if (!this.instance) {
            this.instance = new VscriptConsole();
        }
        return this.instance;
    }

    log(...args: any[]): void {
        if (args.length == 0) {
            print('✅  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '✅ ');
            });
        }
    }

    error(...args: any[]): void {
        if (args.length == 0) {
            print('❌  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '❌ ');
            });
        }
    }

    warn(...args: any[]): void {
        if (args.length == 0) {
            print('⚠️  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '⚠️ ');
            });
        }
    }

    private print(content: any, identifier?: string): void {
        if (!IsInToolsMode()) {
            return;
        }
        let result = '';
        if (identifier) {
            result += identifier + ' ';
        }
        let content_string = tostring(content);
        result += content_string;
        if (typeof content == 'object') {
            result +=
                '\n----------------- ' +
                content_string +
                ' start -----------------';
            for (const [k, v] of Object.entries(content)) {
                result +=
                    '\n' +
                    string.format('%-20s', k) +
                    ' = ' +
                    tostring(v) +
                    ' (' +
                    type(v) +
                    ')';
            }
            result +=
                '\n------------------ ' +
                content_string +
                ' end ------------------\n';
        }
        print(result);
    }
}

export const console = VscriptConsole.getInstance();
