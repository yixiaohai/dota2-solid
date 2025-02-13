interface timer {
    create( callback: (this: void) => void | number,delay?: number): any;
    remove(name: any): void;
}
