import { reloadable } from '../utils/tstl-utils';
import '../utils/timers';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class App {
    static Activate() {
        print('Activate');

    }

    static Precache() {
        print('Precache');
    }
}
