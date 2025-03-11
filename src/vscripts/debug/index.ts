import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class Debug {
    Activate() {
        print('Debug');

        CustomGameEventManager.RegisterListener<
            CustomGameEventDeclarations['debug_event']
        >('debug_event', (_, event) => {
            this.DebugEvent(event);
        });
    }

    DebugEvent(event: CustomGameEventDeclarations['debug_event']) {
        print('DebugEvent123456');
        DeepPrintTable(event);
        if (event.event === 'reload') {
            SendToConsole('script_reload');
        }
    }
}
