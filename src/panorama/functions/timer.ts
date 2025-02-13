class ScheduleTimer implements timer {
    private static instance: ScheduleTimer;

    private constructor() {} // 防止外部实例化
    static getInstance(): ScheduleTimer {
        if (!this.instance) {
            this.instance = new ScheduleTimer();
        }
        return this.instance;
    }

    private activeTimers = new Map<ScheduleID, ScheduleID>();

    create(delay: number, callback: (this: void) => void | number): ScheduleID {
        const scheduleWrapper = (parentHandle?: ScheduleID): ScheduleID => {
            const handle = $.Schedule(delay, () => {
                const result = callback();
                // 处理重新调度
                if (typeof result === 'number') {
                    scheduleWrapper(parentScheduleID);
                } else {
                    this.activeTimers.delete(parentScheduleID);
                }
            });

            const parentScheduleID = parentHandle ? parentHandle : handle;
            this.activeTimers.set(parentScheduleID, handle);

            return handle;
        };
        return scheduleWrapper();
    }

    remove(id: ScheduleID): void {
        const entry = this.activeTimers.get(id);
        if (entry) {
            $.CancelScheduled(entry);
        }
        this.activeTimers.delete(id);
    }
}

export const timer = ScheduleTimer.getInstance();
