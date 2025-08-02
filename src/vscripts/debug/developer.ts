import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class Developer {
    constructor() {
        print('Developer');
        CustomGameEventManager.RegisterListener(
            'c2s_console_command',
            (_, data) => {
                this.ConsoleCommand(data.command);
            }
        );

        CustomGameEventManager.RegisterListener(
            'c2s_convars_float',
            (_, data) => {
                this.ConvarsFloat(data.command, data.value);
            }
        );
    }

    ConsoleCommand(command: string) {
        SendToServerConsole(command);
    }

    ConvarsFloat(command: string, value: number) {
        Convars.SetFloat(command, value);
    }
}
