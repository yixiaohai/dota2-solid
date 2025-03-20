import { reloadable } from '../utils/tstl-utils';
import { console } from '../utils/console';
import { timer } from '../utils/timer';

@reloadable
export class App {
    Activate() {
        // 强制跳过所有模型绑定
        SendToServerConsole('dota_combine_models 0');

        print('Activate3');
    }
}
