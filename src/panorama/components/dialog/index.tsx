import css from 'solid-panorama-all-in-jsx/css.macro';

const dialogStyle = css`
    width: 100%;
    height: 100%;
    background-color: #060606f9;
    z-index: 9999;
    transition-property: opacity, background-color;
    transition-duration: 0.3s;
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
        transform: translateX(0px) translateY(0px);
        transition-property: opacity, transform;
        transition-duration: 0.1s;
        transition-timing-function: ease-in;
    }

    &.minimized .box {
        opacity: 0;
        transform: translateX(0px) translateY(-120px);
    }

    .title {
        font-size: 30px;
        font-weight: thin;
        color: #fff;
        horizontal-align: center;
    }

    .content {
        horizontal-align: center;
        flow-children: down;
        margin-top: 20px;
    }

    .error {
        height: 30px;
        width: 100%;
        margin-bottom: 10px;
        flow-children: left;
    }

    .error Label {
        color: #f5222d;
        font-size: 18px;
        horizontal-align: center;
        vertical-align: center;
        width: 100%;
        text-align: left;
        visibility: collapse;
    }

    .describe {
        font-size: 18px;
        color: #cccccc;
        horizontal-align: center;
        vertical-align: center;
        width: 100%;
        text-align: left;
        margin-top: 10px;
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

interface DialogActions {
    open: (title: string, describe: string) => void;
    close: () => void;
}

class DialogManager implements DialogActions {
    private static instance: DialogManager;
    private static dialog: Panel;
    private static title: LabelPanel;
    private static describe: LabelPanel;

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
        console.log('Dialog init');
        const DialogShade = $.CreatePanel('Panel', $.GetContextPanel(), '', {
            class: dialogStyle + ' minimized'
        });
        DialogShade.SetPanelEvent('oncancel', () => {
            console.log('Dialog cancel');
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
        const error = $.CreatePanel('Label', content, '', {
            class: 'error'
        });
        const input = $.CreatePanel('TextEntry', content, '', {
            class: 'input'
        });
        input.SetPanelEvent('oncancel', () => {
            console.log('Dialog cancel');
            this.close();
        });
        DialogManager.describe = $.CreatePanel('Label', content, '', {
            class: 'describe'
        });
        const down = $.CreatePanel('Panel', DialogPanel, '', {
            class: 'down'
        });
        const button_ok = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_ok, '').text = '#ok';
        const button_reset = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_reset, '').text = '#reset';
        const button_cancel = $.CreatePanel('Button', down, '', {
            class: 'button'
        });
        $.CreatePanel('Label', button_cancel, '').text = '#cancel';
        button_cancel.SetPanelEvent('onactivate', () => {
            console.log('Dialog cancel');
            this.close();
        });
    }

    public open = (title: string, describe: string) => {
        DialogManager.title.text = title;
        DialogManager.describe.text = describe;
        DialogManager.dialog.RemoveClass('minimized');
        DialogManager.dialog.SetFocus()
    };

    public close = () => {
        console.log('Dialog close');
        DialogManager.dialog.AddClass('minimized');
    };
}

// 导出单例实例
export const dialog = DialogManager.getInstance();
