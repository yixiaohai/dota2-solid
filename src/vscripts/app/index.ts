import { reloadable } from '../utils/tstl-utils';
import '../utils/timers';

interface Updatable {
    update(): number;
}

class Clock implements Updatable {
    private time = 0;

    start() {
        const wrongThis = { random: 123 };

    }

    update() {
        this.time = GameRules.GetGameTime();
        print(`A 当前时间戳: ${this.time}`);
        return 1;
    }
}

@reloadable
export class App {
    private count = 0; // 私有状态
    static Activate() {
        print('Activate');

        const myCounter = new Clock();
        myCounter.start();
    }

    static Precache() {
        print('Precache');
    }
}
