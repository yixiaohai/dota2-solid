import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class App {
    Activate() {
        print('Activate3');
        ListenToGameEvent(
            'dota_tutorial_shop_toggled',
            event => {
                this.OnShopToggled(event);
            },
            undefined
        );
        CustomGameEventManager.RegisterListener('test', (_, event) => {
            DeepPrintTable(event);
            this.Test(event);
        });
    }

    static Precache() {
        print('Precache');
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
