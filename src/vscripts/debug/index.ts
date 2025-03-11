import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';
import { Hero } from './hero';
import { Developer } from './developer';

@reloadable
export class Debug {
    Activate() {
        new Hero();
        new Developer();
    }
}
