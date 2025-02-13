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

    create(
        callback: (this: void) => void | number,
        delay?: number
    ): ScheduleID {
        const scheduleWrapper = (
            parentHandle?: ScheduleID,
            _delay?: number
        ): ScheduleID => {
            _delay = _delay ? _delay : delay ?? 0 ;
            const handle = $.Schedule(_delay, () => {
                const result = callback();
                // 处理重新调度
                if (typeof result === 'number') {
                    scheduleWrapper(parentScheduleID, result);
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
