import { Component, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';

interface InputProps {
    type?: 1 | 2;
    flow?: boolean;
    style?: Partial<PanelStyle>;
}

const inputStyle = css`
    border: 1px solid #373c44;
    height: 36px;
    padding: 5px 7px 3px 7px;
    color: white;
    font-size: 20px;
    text-overflow: clip;
    white-space: nowrap;

    &.style2 {
        background-color: gradient(
            linear,
            0% 0%,
            0% 100%,
            from(#373c44),
            to(#222222ff)
        );
    }

    &.flow {
        width: fill-parent-flow(1);
    }
`;

export const Input: Component<InputProps> = props => {
    let textEntryRef: TextEntry | undefined;

    // 组件挂载后执行
    onMount(() => {
        if (textEntryRef) {
            textEntryRef.SetDisableFocusOnMouseDown(false);
        }
    });

    return (
        <TextEntry
            class={`${inputStyle}  ${
                props.type ? `style${props.type}` : 'style1'
            } `}
            classList={{
                flow: props.flow === true
            }}
            style={props.style}
            ref={textEntryRef}
        ></TextEntry>
    );
};
