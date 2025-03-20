interface timer {
    create( callback: (this: void) => void | number,delay?: number): string;
    remove(name: string): void;
}

class Timer implements timer {
    private static instance: Timer;

    private constructor() {} // 防止外部实例化
    static getInstance(): Timer {
        if (!this.instance) {
            this.instance = new Timer();
        }
        return this.instance;
    }

    create(callback: (this: void) => void | number, delay?: number): string {
        const timer_name = DoUniqueString('timer');
        GameRules.GetGameModeEntity().SetContextThink(
            timer_name,
            () => {
                return callback() ?? undefined;
            },
            delay ?? 0
        );
        return timer_name;
    }

    remove(name: string): void {
        GameRules.GetGameModeEntity().StopThink(name);
    }
}

export const timer = Timer.getInstance();
