import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class Developer {
    constructor() {
        CustomGameEventManager.RegisterListener(
            'c2s_console_command',
            (_, data) => {
                this.ConsoleCommand(data.command);
            }
        );
    }

    ConsoleCommand(command: string) {
        SendToConsole(command);
    }
}
