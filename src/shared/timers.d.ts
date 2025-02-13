interface timer {
    create(delay: number, callback: (this: void) => void | number): string | ScheduleID;
    remove(name: string | ScheduleID): void;
}
