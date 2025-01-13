import { Component, createMemo, createSignal, For, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from './manager';

const MenuStyle = css`
    margin-top: 12px;
    margin-left: 10px;
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
`;

interface LayerProps {
    name: string;
    type?: string;
    children?: JSX.Element | JSX.Element[];
}

const Layer: Component<LayerProps> = props => {
    onMount(() => {
        console.log('Created Layer View');
        layer.create(props.name, props.type);
        layer.close(props.name, props.type);
    });

    createMemo(() => {
        console.log('createMemo');
        console.logx(layer.get(props.name, props.type));
    });

    return (
        <Panel
            class={`${MenuStyle} ${
                layer.get(props.name, props.type) ? '' : `minimized`
            }`}
        >
            {props.children}
        </Panel>
    );
};



export { Layer };
