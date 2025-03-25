import { Component, For } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

const MenuStyle = css`
    margin-top: 13px;
    margin-left: 0px;
    horizontal-align: left;
    vertical-align: top;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;
    z-index: -1;

    &.minimized {
        opacity: 0;
    }

    &.horizontal {
        flow-children: right;
        min-height: 30px;
    }

    &.vertical {
        min-width: 30px;
        flow-children: down;
    }

    &.horizontal .box {
        height: 100%;
        margin-left: 18px;
    }

    &.horizontal .box.minimized {
        width: 0;
    }

    &.vertical .box {
        width: 100%;
        margin-top: 18px;
    }

    &.vertical .box.minimized {
        height: 0;
    }

    .box Image {
        vertical-align: middle;
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
    onactivate: Function;
    label?: string;
    show?: boolean;
    style?: Partial<PanelStyle>;
}

interface MenuProps {
    items: MenuItem[];
    mode?: 'vertical' | 'horizontal';
    show?: boolean;
    style?: Partial<PanelStyle>;
}

export const Menu: Component<MenuProps> = props => {
    return (
        <Panel
            class={`${MenuStyle} ${props.mode === 'vertical' ? 'vertical' : 'horizontal'} `}
            classList={{ minimized: !props.show }}
            style={props.style}
        >
            <For each={props.items}>
                {i => (
                    <Panel
                        class="box"
                        tooltip_text={i.label ? $.Localize(i.label) : ''}
                        onactivate={() => {
                            i.onactivate();
                        }}
                    >
                        <Image src={`${i.icon}`} style={i.style} />
                    </Panel>
                )}
            </For>
        </Panel>
    );
};
