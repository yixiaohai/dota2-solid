import { Component, createSignal, onCleanup, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { console } from '../../utils/console';

interface ButtonnProps {
    icon?: string;
    text?: string;
    tooltip_text?: string;
    type?: 1 | 2;
    color?:
    | 'red'
    | 'green'
    | 'blue'
    | 'grey'
    | 'yellow'
    | 'orange'
    | 'cyan'
    | 'purple'
    | 'grey';
    flow?: boolean;
    disabled?: boolean;
    onClick?: Function;
    style?: Partial<PanelStyle>;
    fontsize?: number;
    toggle?: boolean;
    checked?: boolean;
}

const btnStyle = css`
    margin: 5px;
    padding: 5px;
    flow-children: right;

    &:disabled {
        wash-color: #000000aa;
        saturation: 0;
    }

    &.flow {
        width: fill-parent-flow(1);
    }

    .toggle {
        width: 18px;
        height: 18px;
        border: 2px solid #707070;
        background-color: #000;
        vertical-align: middle;
        margin-right: 5px;
        transition-property: background-color, box-shadow, border;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
    }

    &:hover .toggle {
        border: 2px solid #697879;
    }

    .toggle.checked {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#e7f6f5),
            to(#a0d6d7)
        );
        box-shadow: #5b62bf77 0px 0px 8px 0px;
    }

    &.style1 {
        background-color: #3e4144;
        border: 1px solid #4e5155;
        transition-property: background-color, border, color;
        transition-duration: 0.15s;
        transition-timing-function: ease-in-out;
    }

    &.style1:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#676b70),
            to(#3e4144)
        );
        border: 1px solid #686b70;
    }

    &.style1 Label {
        horizontal-align: center;
        vertical-align: middle;
        color: #d8dade;
        text-transform: uppercase;
        font-family: defaultFont;
        font-weight: normal;
        text-overflow: shrink;
        letter-spacing: 1px;
    }

    &.style1:enabled:hover Label {
        color: #fff;
    }

    &.style1 Label.icon {
        brightness: 0.8;
        saturation: 0.6;
        background-size: 19px;
        background-repeat: no-repeat;
        background-position: left;
        transition-property: brightness, saturation;
        transition-duration: 0.2s;
        padding-left: 24px;
    }

    &.style1.red {
        background-color: #6d4a4e;
        border: 1px solid #9b6369;
    }

    &.style1.red:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#be4f5c),
            to(#913943)
        );
        border: 1px solid #eb5f70;
    }

    &.style1.green {
        background-color: #42705b;
        border: 1px solid #4e9e7a;
    }

    &.style1.green:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#3cc486),
            to(#259c67)
        );
        border: 1px solid #3feb9d;
    }

    &.style1.blue {
        background-color: #35495f;
        border: 1px solid #4e78a1;
    }

    &.style1.blue:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#3e87cf),
            to(#2765a7)
        );
        border: 1px solid #499bdf;
    }

    &.style1.yellow {
        background-color: #8a804c;
        border: 1px solid #a8995a;
    }

    &.style1.yellow:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#e6c64d),
            to(#b89f3a)
        );
        border: 1px solid #ffe15e;
    }

    &.style1.orange {
        background-color: #8a5c4a;
        border: 1px solid #a96f55;
    }

    &.style1.orange:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#d9753c),
            to(#b0552d)
        );
        border: 1px solid #ff8c4f;
    }

    &.style1.cyan {
        background-color: #3d6d6d;
        border: 1px solid #4d8f8f;
    }

    &.style1.cyan:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#3cc4c4),
            to(#259c9c)
        );
        border: 1px solid #3febeb;
    }

    &.style1.purple {
        background-color: #5a4a6d;
        border: 1px solid #735a8a;
    }

    &.style1.purple:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#8a4dcf),
            to(#6d3aa7)
        );
        border: 1px solid #9b5edf;
    }

    &.style1.grey {
        background-color: #555555;
        border: 1px solid #707070;
    }

    &.style1.grey:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            70% 0%,
            from(#888888),
            to(#666666)
        );
        border: 1px solid #a0a0a0;
    }

    &.style2 {
        background-image: url('s2r://panorama/images/backgrounds/background_play_button_large_2x_png.vtex');
        background-size: 320px 120px;
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#53565a),
            to(#3e414433)
        );
        box-shadow: fill #3a3a3a44 1px 1px 8px 1px;
        border-top: 1px solid #575a5f44;
        border-right: 1px solid #2d2f3288;
        border-left: 1px solid #575a5f44;
        border-bottom: 1px solid #2d2f3288;
        transition-property: box-shadow, background-color;
        transition-delay: 0s;
        transition-duration: 0.15s;
        transition-timing-function: ease-in-out;
    }

    &.style2:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#676b70),
            to(#53565aff)
        );
        box-shadow: fill #4d4d4daa 0px 0px 8px 0px;
    }

    &.style2 Label {
        color: white;
        text-align: center;
        text-transform: uppercase;
        text-overflow: ellipsis;
        horizontal-align: center;
        vertical-align: center;
        font-weight: bold;
        letter-spacing: 3px;
    }

    &.style2:enabled:hover Label {
        color: #ffffff;
    }

    &.style2 Label.icon {
        brightness: 0.8;
        saturation: 0.6;
        background-size: 30px;
        background-repeat: no-repeat;
        background-position: left;
        transition-property: brightness, saturation;
        transition-duration: 0.2s;
        padding-left: 35px;
    }

    &.style2.red {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a15a5a),
            to(#d6878733)
        );
        box-shadow: fill #66002a44 1px 1px 8px 1px;
        border-top: 1px solid #ffcccc44;
        border-right: 1px solid #33000088;
        border-left: 1px solid #ffcccc44;
        border-bottom: 1px solid #33000088;
    }

    &.style2.red:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a15a5a),
            to(#d68787ff)
        );
        box-shadow: fill #4f414daa 0px 0px 8px 0px;
    }

    &.style2.orange {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a17d5a),
            to(#d6b28733)
        );
        box-shadow: fill #66330044 1px 1px 8px 1px;
        border-top: 1px solid #ffe4cc44;
        border-right: 1px solid #331a0088;
        border-left: 1px solid #ffe4cc44;
        border-bottom: 1px solid #331a0088;
    }

    &.style2.orange:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a17d5a),
            to(#d6b287ff)
        );
        box-shadow: fill #4f4a41aa 0px 0px 8px 0px;
    }

    &.style2.yellow {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a1a15a),
            to(#d6d68733)
        );
        box-shadow: fill #66660044 1px 1px 8px 1px;
        border-top: 1px solid #ffffcc44;
        border-right: 1px solid #33330088;
        border-left: 1px solid #ffffcc44;
        border-bottom: 1px solid #33330088;
    }

    &.style2.yellow:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#a1a15a),
            to(#d6d687ff)
        );
        box-shadow: fill #4f4f41aa 0px 0px 8px 0px;
    }

    &.style2.green {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5aa15e),
            to(#87d69533)
        );
        box-shadow: fill #002a6644 1px 1px 8px 1px;
        border-top: 1px solid #ffffff44;
        border-right: 1px solid #00000088;
        border-left: 1px solid #ffffff44;
        border-bottom: 1px solid #00000088;
    }

    &.style2.green:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5aa15e),
            to(#87d695ff)
        );
        box-shadow: fill #414f4daa 0px 0px 8px 0px;
    }

    &.style2.cyan {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5aa1a1),
            to(#87d6d633)
        );
        box-shadow: fill #00666644 1px 1px 8px 1px;
        border-top: 1px solid #ccffff44;
        border-right: 1px solid #00333388;
        border-left: 1px solid #ccffff44;
        border-bottom: 1px solid #00333388;
    }

    &.style2.cyan:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5aa1a1),
            to(#87d6d6ff)
        );
        box-shadow: fill #414f4faa 0px 0px 8px 0px;
    }

    &.style2.blue {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5a76a1),
            to(#879cd633)
        );
        box-shadow: fill #002a6644 1px 1px 8px 1px;
        border-top: 1px solid #cce4ff44;
        border-right: 1px solid #001a3388;
        border-left: 1px solid #cce4ff44;
        border-bottom: 1px solid #001a3388;
    }

    &.style2.blue:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#5a76a1),
            to(#879cd6ff)
        );
        box-shadow: fill #414d4faa 0px 0px 8px 0px;
    }

    &.style2.purple {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#7d5aa1),
            to(#b287d633)
        );
        box-shadow: fill #33006644 1px 1px 8px 1px;
        border-top: 1px solid #e6ccff44;
        border-right: 1px solid #1a003388;
        border-left: 1px solid #e6ccff44;
        border-bottom: 1px solid #1a003388;
    }

    &.style2.purple:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#7d5aa1),
            to(#b287d6ff)
        );
        box-shadow: fill #4d414faa 0px 0px 8px 0px;
    }

    &.style2.grey {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#8c8c8c),
            to(#d6d6d633)
        );
        box-shadow: fill #3a3a3a44 1px 1px 8px 1px;
        border-top: 1px solid #ffffff66;
        border-right: 1px solid #00000055;
        border-left: 1px solid #ffffff66;
        border-bottom: 1px solid #00000055;
    }

    &.style2.grey:enabled:hover {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#8c8c8c),
            to(#d6d6d6ff)
        );
        box-shadow: fill #4d4d4daa 0px 0px 8px 0px;
    }
`;

export const CButton: Component<ButtonnProps> = props => {
    const [isChecked, setIsChecked] = createSignal(props.checked || false);


    return (
        <Panel
            class={`${btnStyle} ${props.type ? `style${props.type}` : 'style1'
                } `}
            classList={{
                red: props.color === 'red',
                orange: props.color === 'orange',
                yellow: props.color === 'yellow',
                green: props.color === 'green',
                cyan: props.color === 'cyan',
                blue: props.color === 'blue',
                purple: props.color === 'purple',
                grey: props.color === 'grey',
                flow: props.flow === true
            }}
            style={props.style}
            enabled={!props.disabled}
            tooltip_text={props.tooltip_text}
            onactivate={() => {
                if (props.toggle) {
                    setIsChecked(!isChecked());
                    props.onClick?.(isChecked());
                } else {
                    props.onClick?.();
                }
            }}
        >
            {props.toggle && (
                <Panel class={`toggle ${isChecked() ? 'checked' : ''}`}></Panel>
            )}
            <Label
                text={props.text}
                visible={!!props.text}
                classList={{ icon: !!props.icon }}
                style={{
                    backgroundImage: `url('${props.icon}')`,
                    fontSize: props.fontsize ? `${props.fontsize}px` : '17px'
                }}
            />
        </Panel>
    );
};
