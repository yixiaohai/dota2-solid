import { Component, For } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

const MenuStyle = css`
    height: 30px;
    margin-top: 17px;
    margin-left: 140px;
    horizontal-align: left;
    vertical-align: top;
    flow-children: right;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;
    z-index: -1;

    &.minimized {
        opacity: 0;
    }

    .box {
        width: 30px;
        height: 30px;
        margin-left: 18px;
        flow-children: down;
    }

    .box.minimized {
        width: 0;
    }

    .box Image {
        vertical-align: top;
        horizontal-align: center;
        tooltip-position: bottom;
        tooltip-body-position: 50% 50%;
        wash-color: #cdf;
        opacity: 0.5;
        transition-property: opacity;
        transition-duration: 0.2s;
        img-shadow: 0px 0px 3px 3 black;
    }

    .box Image:hover {
        opacity: 1;
        wash-color: #fff;
    }
`;

export interface MenuItem {
    icon: string;
    func: Function;
    key?: string;
    label?: string;
    show?: boolean;
    style?: Partial<PanelStyle>;
}

interface MenuProps {
    items: MenuItem[];
    mode?: string;
    show?: boolean;
}

export const Menu: Component<MenuProps> = props => {
    return (
        <Panel class={`${MenuStyle} ${props.show ? '' : `minimized`}`}>
            <For each={props.items}>
                {i => (
                    <Panel
                        class="box"
                        tooltip_text={i.label}
                        onactivate={() => {
                            i.func();
                        }}
                    >
                        <Image src={`${i.icon}`} style={i.style} />
                    </Panel>
                )}
            </For>
        </Panel>
    );
};
