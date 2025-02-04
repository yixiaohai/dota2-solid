import { children, Component, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from './manager';

const LayerStyle = css`
    width: 100%;
    height: 100%;
    opacity: 1;
    transition-property: opacity;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;
    z-index: -1;

    &.minimized {
        opacity: 0;
    }

    .shade {
        width: 100%;
        height: 100%;
        z-index: 1;
    }

    .content {
        z-index: 10;
    }
`;

interface LayerProps {
    name: string;
    class?: string;
    type?: string;
    shade?: number;
    shadeClose?: boolean;
    children?: JSX.Element | JSX.Element[];
    onOpen?: () => void;
    onClose?: () => void;
}

export const Layer: Component<LayerProps> = props => {
    const resolved = children(() => props.children);

    onMount(() => {
        console.log('Created Layer View', props.name, props.type);
        layer.create(
            props.name,
            props.type,
            props.shade,
            props.shadeClose,
            props.onOpen,
            props.onClose
        );

        const list = resolved.toArray();
        for (const [index, child] of list.entries()) {
            child.SetPanelEvent('onactivate', () => {});
            child.SetHasClass('content', index === list.length - 1);
        }
    });

    return (
        <Panel
            class={props.class ? props.class : LayerStyle}
            classList={{ minimized: !layer.isOpen(props.name, props.type) }}
        >
            {resolved()}
            <Panel
                class="shade" // 添加背景遮罩层
                style={{
                    backgroundColor: `rgba(0, 0, 0, ${layer.shade(
                        props.name,
                        props.type
                    )})`
                }}
                hittest={layer.shadeClose(props.name, props.type)}
                onactivate={() => {
                    if (layer.shadeClose(props.name, props.type)) {
                        layer.close(props.name, props.type);
                    }
                }}
            />
        </Panel>
    );
};
