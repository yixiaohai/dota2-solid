import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class Developer {
    constructor() {
        CustomGameEventManager.RegisterListener('c2s_script_reload', () => {
            this.ScriptReload();
        });
    }

    ScriptReload() {
        console.log('c2s_script_reload');
        SendToServerConsole('script_reload');
    }

    SpawnCallback() {
        console.log('spawn_callback');
    }
}
