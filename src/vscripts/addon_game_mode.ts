import { App } from './app/index';
Object.assign(getfenv(), {
    Activate: () => {
        App.prototype.Activate();
    },
    Precache: App.Precache
});
