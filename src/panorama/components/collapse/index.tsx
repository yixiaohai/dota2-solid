import { Component, createSignal, For } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

const CollapseStyle = css`
    width: fill-parent-flow(1);
    flow-children: down;

    .collapse_box {
        width: 100%;
        flow-children: down;
    }

    .collapse_title {
        width: 100%;
        flow-children: right;
        border-left: 2px solid #ff5005;
        background-color: gradient(
            linear,
            0% 0%,
            100% 0%,
            from(#833312ff),
            to(#8334120b)
        );
        padding: 10px;
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

    .collapse_icon.rotated {
        transform: rotateZ(90deg);
    }

    .collapse_content {
        border-left: 2px solid rgba(47, 78, 105, 0.5);
        background-color: gradient(
            linear,
            0% 0%,
            50% 100%,
            from(rgb(18, 28, 37)),
            to(rgb(6, 6, 7))
        );
        padding: 20px;
        width: 100%;
        opacity: 1;
        transition-property: opacity, height;
        transition-duration: 0.35s;
        transition-timing-function: ease-in-out;
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
        <Panel class={CollapseStyle} style={props.style}>
            <For each={props.items}>
                {i => (
                    <Panel class="collapse_box" style={i.style}>
                        <Panel
                            class="collapse_title"
                            onactivate={() => handleActivate(i.key)}
                        >
                            <Image
                                class="collapse_icon"
                                src={`file://{images}/control_icons/24px/chevron_fancy_right.vsvg`}
                                classList={{ rotated: activeKey() === i.key }}
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
