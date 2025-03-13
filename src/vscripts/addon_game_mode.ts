import { App } from './app/index';
import Precache from './app/Precache';
import { Debug } from './debug';
Object.assign(getfenv(), {
    Activate: () => {
        if (IsInToolsMode()) {
            Debug.prototype.Activate();
        }
        App.prototype.Activate();
    },
    Precache: Precache
});
