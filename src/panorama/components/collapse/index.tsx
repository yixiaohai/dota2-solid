import { Component, createSignal, For } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

const CollapseStyle = css`
    width: fill-parent-flow(1);
    flow-children: down;

    .collapse_box {
        width: 100%;
        flow-children: down;
    }

    &.style2 .collapse_box {
        background-color: gradient(
            radial,
            0% 0%,
            0% 0%,
            140% 100%,
            from(#202833e4),
            to(#06080e)
        );
        border: 1px solid white;
        border-brush: gradient(
            linear,
            0% 0%,
            5% 60%,
            from(rgba(255, 255, 255, 0.04)),
            to(rgba(255, 255, 255, 0.01))
        );
    }

    .collapse_title {
        width: 100%;
        flow-children: right;
        padding: 10px;
        wash-color: #000000aa;
    }

    .active.collapse_title,
    .collapse_title:hover {
        wash-color: none;
    }

    &.style2 .collapse_title {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#434f5e5e),
            to(#17191f86)
        );
        box-shadow: inset 0px -1px 1px rgba(0, 0, 0, 0.2);
    }

    &.style3 .collapse_title {
        border-left: 2px solid #ff5005;
        background-color: gradient(
            linear,
            0% 0%,
            100% 0%,
            from(#833312ff),
            to(#8334120b)
        );
    }

    .collapse_title Label {
        font-size: 20px;
        color: whitesmoke;
        letter-spacing: 2px;
        font-family: titleFont;
        font-weight: semi-bold;
        text-shadow: 0px 4px 12px rgba(0, 0, 0, 0.8);
    }

    .collapse_icon {
        width: 20px;
        height: 20px;
        vertical-align: middle;
        margin-right: 10px;
        transition-property: transform;
        transition-duration: 0.35s;
        transition-timing-function: ease-in-out;
    }

    .active .collapse_icon {
        transform: rotateZ(90deg);
    }

    .collapse_content {
        padding: 10px;
        width: 100%;
        opacity: 1;
        transition-property: opacity, height;
        transition-duration: 0.35s;
        transition-timing-function: ease-in-out;
    }

    &.style3 .collapse_content {
        border-left: 2px solid rgba(47, 78, 105, 0.5);
        background-color: gradient(
            linear,
            0% 0%,
            50% 100%,
            from(rgb(18, 28, 37)),
            to(rgb(6, 6, 7))
        );
    }

    .collapse_content.minimized {
        opacity: 0;
        height: 0;
    }
`;

export interface CollapseItem {
    key: string;
    label: string;
    children: JSX.Element | JSX.Element[];
    style?: Partial<PanelStyle>;
}

export interface CollapseProps {
    items: CollapseItem[];
    activeKey?: string;
    type?: 1 | 2 | 3;
    style?: Partial<PanelStyle>;
}

export const Collapse: Component<CollapseProps> = props => {
    const [activeKey, setActiveKey] = createSignal<string | null>(
        props.activeKey || null
    );

    const handleActivate = (key: string) => {
        setActiveKey(current => (current === key ? null : key));
    };

    return (
        <Panel
            class={`${CollapseStyle} ${
                props.type ? `style${props.type}` : 'style1'
            } `}
            style={props.style}
        >
            <For each={props.items}>
                {i => (
                    <Panel class="collapse_box" style={i.style}>
                        <Panel
                            class="collapse_title"
                            classList={{ active: activeKey() === i.key }}
                            onactivate={() => handleActivate(i.key)}
                        >
                            <Image
                                class="collapse_icon"
                                src={`file://{images}/control_icons/24px/chevron_fancy_right.vsvg`}
                            />
                            <Label text={i.label} />
                        </Panel>
                        <Panel
                            class="collapse_content"
                            classList={{ minimized: activeKey() !== i.key }}
                        >
                            {i.children}
                        </Panel>
                    </Panel>
                )}
            </For>
        </Panel>
    );
};
