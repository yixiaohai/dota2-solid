import { forEach } from 'lodash';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { console } from '../../functions/console';

const main = css`
    width: 100%;
    height: 100%;
    background-color: #060606f9;
    z-index: 9999;
    transition-property: opacity, background-color;
    transition-duration: 0.1s;
    transition-timing-function: ease-in;

    &.minimized {
        opacity: 0;
        background-color: #06060600;
    }

    .box {
        border: 1px solid #5e6869;
        background-color: #181818dd;
        box-shadow: #000000aa 0px 0px 8px 0px;
        padding: 32px;
        width: 550px;
        flow-children: down;
        vertical-align: middle;
        horizontal-align: center;
        opacity: 1;
        transform: translateX(0px) translateY(-100px);
        transition-property: opacity, pre-transform-scale2d;
        transition-duration: 0.3s;
        transition-timing-function: ease-in;
    }

    &.minimized .box {
        opacity: 0;
        pre-transform-scale2d: 0.85;
    }

    .title {
        font-size: 30px;
        font-weight: thin;
        color: #afb4b4;
        horizontal-align: center;
        margin-bottom: 20px;
    }

    .content {
        horizontal-align: center;
        flow-children: down;
        width: 100%;
    }

    .input {
        border: 1px solid #373c44;
        height: 36px;
        padding: 5px 7px 3px 7px;
        margin: 10px;
        color: white;
        font-size: 20px;
        text-overflow: clip;
        white-space: nowrap;
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#373c44),
            to(#222222ff)
        );
        width: fill-parent-flow(1);
        visibility: visible;
    }

    .input.big {
        height: 144px;
        white-space: normal;
    }

    .input.minimized {
        visibility: collapse;
    }

    .describe {
        font-size: 18px;
        color: #cccccc;
        width: 100%;
        text-align: left;
        margin-top: 10px;
    }
    .describe.only {
        font-size: 27px;
        color: #fff;
        text-align: center;
    }

    .down {
        flow-children: right;
        horizontal-align: center;
        margin-top: 30px;
        margin-bottom: 20px;
    }

    .button {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#222222),
            to(#4b555d)
        );
        background-image: url('s2r://panorama/images/backgrounds/background_play_button_2x_png.vtex');
        background-size: cover;
        border: 1px solid #83838390;
        margin: 8px;
        width: 110px;
        padding: 10px 30px;
        transition-property: background-color, wash-color;
        transition-delay: 0s;
        transition-duration: 0.1s;
        transition-timing-function: linear;
        visibility: visible;
    }

    .button.minimized {
        visibility: collapse;
    }

    .button:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#58636e),
            to(#53626e)
        );
    }

    .button Label {
        color: white;
        font-size: 20px;
        horizontal-align: center;
        vertical-align: middle;
        text-transform: uppercase;
        text-overflow: shrink;
        text-shadow: 0px 0px 5px 3 #000000;
        font-weight: semi-bold;
        letter-spacing: 1px;
    }
`;

export interface DialogProps {
    title: string;
    describe: string;
    input?: boolean;
    inputBig?: boolean;
    defaultValue?: string;
    onOk?: Function;
    noCancel?: boolean;
}

interface DialogActions {
    open: (props: DialogProps) => void;
    close: () => void;
}

class DialogManager implements DialogActions {
    private static instance: DialogManager;
    private static dialog: Panel;
    private static title: LabelPanel;
    private static describe: LabelPanel;
    private static input: TextEntry;
    private static button_ok: Button;
    private static button_reset: Button;
    private static button_cancel: Button;

    // 单例模式
    public static getInstance(): DialogManager {
        if (!DialogManager.instance) {
            DialogManager.instance = new DialogManager();
        }
        return DialogManager.instance;
    }

    private constructor() {
        this.initialize();
    }

    private initialize() {
        console.log('Dialog初始化');

        const DialogShade = $.CreatePanel('Panel', $.GetContextPanel(), '', {
            class: main + ' minimized'
        });
        DialogShade.SetPanelEvent('onactivate', () => {});
        DialogShade.SetPanelEvent('oncancel', () => {
            this.close();
        });
        DialogManager.dialog = DialogShade;

        const DialogPanel = $.CreatePanel('Panel', DialogShade, '', {
            class: 'box'
        });

        DialogManager.title = $.CreatePanel('Label', DialogPanel, '', {
            class: 'title'
        });
        const content = $.CreatePanel('Panel', DialogPanel, '', {
            class: 'content'
        });
        const input = $.CreatePanel('TextEntry', content, '', {
            class: 'input'
        });
        input.SetPanelEvent('oncancel', () => {
            this.close();
        });
        DialogManager.input = input;

        DialogManager.describe = $.CreatePanel('Label', content, '', {
            class: 'describe'
        });
        const down = $.CreatePanel('Panel', DialogPanel, '', {
            class: 'down'
        });
        const button_ok = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_ok, '').text = $.Localize('#ok');
        DialogManager.button_ok = button_ok;
        const button_reset = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_reset, '').text = $.Localize('#reset');
        DialogManager.button_reset = button_reset;
        const button_cancel = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_cancel, '').text = $.Localize('#cancel');
        button_cancel.SetPanelEvent('onactivate', () => {
            this.close();
        });
        DialogManager.button_cancel = button_cancel;
    }

    public open = (props: DialogProps) => {
        DialogManager.title.text = $.Localize(props.title);
        DialogManager.describe.text = $.Localize(props.describe);
        DialogManager.dialog.RemoveClass('minimized');
        DialogManager.dialog.SetFocus();

        if (!props.input) {
            DialogManager.input.AddClass('minimized');
            DialogManager.describe.AddClass('only');
        } else {
            DialogManager.input.RemoveClass('minimized');
            DialogManager.describe.RemoveClass('only');
            if (props.inputBig) {
                DialogManager.input.AddClass('big');
            } else {
                DialogManager.input.RemoveClass('big');
            }
        }
        if (props.defaultValue) {
            const defaultValue = props.defaultValue;
            DialogManager.input.text = defaultValue;
            DialogManager.button_reset.RemoveClass('minimized');
            DialogManager.button_reset.SetPanelEvent('onactivate', () => {
                DialogManager.input.text = defaultValue;
            });
        } else {
            DialogManager.button_reset.AddClass('minimized');
        }

        DialogManager.button_ok.SetPanelEvent('onactivate', () => {
            if (props.onOk) {
                props.onOk(DialogManager.input.text);
            }
            this.close();
        });

        if (props.noCancel) {
            DialogManager.button_cancel.AddClass('minimized');
        } else {
            DialogManager.button_cancel.RemoveClass('minimized');
        }
    };

    public close = () => {
        DialogManager.dialog.AddClass('minimized');
        $.DispatchEvent('DropInputFocus');
    };
}

// 导出单例实例
export const dialog = DialogManager.getInstance();
