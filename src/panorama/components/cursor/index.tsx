import css from 'solid-panorama-all-in-jsx/css.macro';
import { timer } from '../../utils/timer';
import { console } from '../../utils/console';
import { onCleanup } from 'solid-js';

type MouseCallback = (
    eventType: MouseEvent,
    button: MouseButton | MouseScrollDirection,
    pos: [number, number, number]
) => void;

type cursorStyle = 'cast';

const main = css`
    width: 32px;
    height: 32px;
    z-index: 99999;
    opacity: 1;
    background-image: url('s2r://panorama/images/cursor/cursor_cast_png.vtex');

    &.minimized {
        opacity: 0;
    }
`;

class MouseListener {
    private static instance: MouseListener;
    private currentCallback: MouseCallback | null = null;
    private static cursor: Panel | null;
    private thinkID: ScheduleID | null = null;

    private constructor() {
        this.cursor_init();
        this.setupGlobalListener();

        onCleanup(() => {
            console.log('销毁 MouseListener 实例');
        });
    }

    private cursor_init() {
        MouseListener.cursor = $.CreatePanel('Panel', $.GetContextPanel(), '', {
            class: main + ' minimized'
        });
    }

    public static getInstance(): MouseListener {
        if (!MouseListener.instance) {
            MouseListener.instance = new MouseListener();
        }
        return MouseListener.instance;
    }

    private setupGlobalListener() {
        GameUI.SetMouseCallback(
            (
                eventType: MouseEvent,
                button: MouseButton | MouseScrollDirection
            ) => {
                const pos = GameUI.GetScreenWorldPosition(
                    GameUI.GetCursorPosition()
                );
                if (!pos) {
                    console.error('点击鼠标位置获取失败');
                    return false;
                }
                this.currentCallback?.(eventType, button, pos);
                return false;
            }
        );
    }

    public start(
        callback: MouseCallback,
        think?: (pos: [number, number, number]) => void,
        cursorStyle?: cursorStyle
    ): () => void {
        if (this.currentCallback) {
            this.end();
        }

        this.currentCallback = callback;
        if (cursorStyle) {
            GameEvents.SendCustomGameEventToServer('c2s_console_command', {
                command: 'dota_hide_cursor 1'
            });
            MouseListener.cursor?.RemoveClass('minimized');
        }
        this.thinkID = timer.create(() => {
            const pos_cursor = GameUI.GetCursorPosition();
            const pos = GameUI.GetScreenWorldPosition(pos_cursor);
            MouseListener.cursor?.SetPositionInPixels(
                (pos_cursor[0] - 16) / MouseListener.cursor.actualuiscale_x,
                (pos_cursor[1] - 16) / MouseListener.cursor.actualuiscale_y,
                0
            );
            if (think) {
                if (pos) {
                    think(pos);
                } else {
                    console.error('监听期间鼠标位置获取失败');
                }
            }
            return 0;
        });
        return () => this.end();
    }

    public end() {
        GameEvents.SendCustomGameEventToServer('c2s_console_command', {
            command: 'dota_hide_cursor 0'
        });
        try {
            MouseListener.cursor?.AddClass('minimized');
        } catch (e) {
            console.error(e);
            MouseListener.cursor = null;
        }

        if (this.thinkID) {
            timer.remove(this.thinkID);
        }

        this.currentCallback = null;
    }
}

// 导出单例实例
export const cursor = MouseListener.getInstance();
