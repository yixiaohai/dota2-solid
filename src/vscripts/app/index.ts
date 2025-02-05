import { reloadable } from "../utils/tstl-utils";



@reloadable
export class App {
    static Activate() {
        print('Activate');
    }

    static Precache() {
        print('Precache');
    }
}
