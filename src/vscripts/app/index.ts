import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { GameConfig } from '../utils/game_config';

@reloadable
export class App {
    Activate() {
        GameConfig();
    }
}
