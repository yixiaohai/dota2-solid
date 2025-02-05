import { App } from './app/index';
Object.assign(getfenv(), {
    Activate: () => {
        App.Activate();
    },
    Precache: App.Precache
});
