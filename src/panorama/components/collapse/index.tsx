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
    }

    .collapse_content {
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
    accordion?: boolean;
    style?: Partial<PanelStyle>;
}

export const Collapse: Component<CollapseProps> = props => {
    const [activeKey, setActiveKey] = createSignal<string | null>(
        props.activeKey?.[0] || null
    );

    const handleActivate = (key: string) => {
        console.log(key);
        setActiveKey(current => (current === key ? null : key));
        console.log(activeKey());
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
