import { App } from './app/index';
import { Debug } from './debug';
Object.assign(getfenv(), {
    Activate: () => {
        Debug.prototype.Activate();
        App.prototype.Activate();
    },
    Precache: App.Precache
});
