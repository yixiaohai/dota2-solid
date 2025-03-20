interface console {
    log(...args: any[]): void;
    error(...args: any[]): void;
}

class PanoramaConsole implements console {
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
        if (args.length == 0) {
            $.Msg('✅  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '✅ ');
            });
        }
    }

    error(...args: any[]): void {
        if (args.length == 0) {
            $.Msg('❌  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '❌ ');
            });
        }
    }

    warn(...args: any[]): void {
        if (args.length == 0) {
            $.Msg('⚠️  nil');
        } else {
            args.forEach(arg => {
                this.print(arg, '⚠️ ');
            });
        }
    }

    private print(content: any, identifier?: string, level?: number): void {
        if (!Game.IsInToolsMode()) {
            return;
        }
        level = level || 0;
        let tempStr = '';
        if (level > 0) {
            for (let index = 0; index < level; index++) {
                tempStr += '\t';
            }
        }
        if (identifier) {
            identifier = identifier + ' ';
        } else {
            identifier = '';
        }
        if (typeof content == 'object') {
            let s = JSON.stringify(content);
            if (s.length > 100) {
                if (level == 0) {
                    $.Msg(tempStr + identifier);
                    $.Msg('{');
                } else {
                    $.Msg(tempStr + identifier + '{');
                }

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
                $.Msg(tempStr + identifier + s);
            }
        } else {
            $.Msg(tempStr + identifier + content);
        }
    }
}

export const console = PanoramaConsole.getInstance();
