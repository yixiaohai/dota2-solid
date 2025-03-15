import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class App {
    Activate() {
        // 强制跳过所有模型绑定
        SendToServerConsole('dota_combine_models 0');

        print('Activate3');
    }

    OnShopToggled(event: any) {
        print('OnShopToggled2');
        DeepPrintTable(event);
    }

    Test(event: any) {
        print('testbbbbbbb');
        print(event);
        DeepPrintTable(event);
        this.Test2();
    }

    Test2() {
        print('testcccccccccccc');
    }
}
