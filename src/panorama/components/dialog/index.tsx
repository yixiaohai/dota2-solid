import { Component, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { Layer } from '../layer';
import { Input } from '../input';
import { CButton } from '../button';

interface DialogProps {
    title: string;
    desc?: string;
    type?: 1 | 2;
    style?: Partial<PanelStyle>;
}

const dialogStyle = css`
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

    &.minimized {
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

`;

export const Dialog: Component<DialogProps> = props => {
    let ErrorLabelRef: LabelPanel | undefined;
    let DescLabelRef: LabelPanel | undefined;

    // 组件挂载后执行
    onMount(() => {});

    return (
        <Layer
            name="dialog"
            type="dialog"
            class={`${dialogStyle}  ${
                props.type ? `style${props.type}` : 'style1'
            } `}
        >
            <Label class="title" text={props.title} />
            <Panel class="content">
                <Panel class="error">
                    <Label ref={ErrorLabelRef} text="-" />
                </Panel>
                <Input flow/>
                <Label ref={DescLabelRef} class="describe" text={props.desc} />
            </Panel>
            <Panel class="down">
                <CButton text="#Ok" type={2} flow/>
                <CButton text="#Reset" type={2} flow/>
                <CButton text="#Cancel" type={2} flow/>
            </Panel>
        </Layer>
    );
};
