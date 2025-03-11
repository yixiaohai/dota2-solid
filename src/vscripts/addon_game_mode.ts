import { App } from './app/index';
import { Debug } from './debug';
Object.assign(getfenv(), {
    Activate: () => {
        if (IsInToolsMode()) {
            Debug.prototype.Activate();
        }
        App.prototype.Activate();
    },
    Precache: App.Precache
});
