import { reloadable } from '../utils/tstl-utils';
import '../utils/timers';

@reloadable
export class App {
    static Activate() {
        print('Activate');

    }

    static Precache() {
        print('Precache');
    }
}
