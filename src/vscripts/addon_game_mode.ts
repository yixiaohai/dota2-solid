import { App } from './app/index';
import Precache from './utils/Precache';
import { Debug } from './debug';
Object.assign(getfenv(), {
    Activate: () => {
        // if (IsInToolsMode()) {
        //     Debug.prototype.Activate();
        // }
        Debug.prototype.Activate();
        App.prototype.Activate();
    },
    Precache: Precache
});
