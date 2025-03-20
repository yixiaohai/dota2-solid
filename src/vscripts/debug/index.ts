import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { Hero } from './hero';
import { Developer } from './developer';
import { Ent } from './ent';
import { SimpleEvent_Check, SimpleEvent_PlayerID, SimpleEvent_Units } from './simple_event';
import { World } from './world';

@reloadable
export class Debug {
    Activate() {
        new Hero();
        new Developer();
        new Ent();
        new World();
        new SimpleEvent_Units();
        new SimpleEvent_PlayerID();
        new SimpleEvent_Check();

    }
}
