import { Accessor, Component, onCleanup, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { console } from '../../utils/console';
import { cursor } from '../cursor';
import { parseInt } from 'lodash';

interface InputProps {
    type?: 1 | 2;
    flow?: boolean;
    style?: Partial<PanelStyle>;
    text?: string | Accessor<string>;
    ontextentrychange?: Function;
    number?: boolean;
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
    let removeListener: Function | undefined;

    const handleClick = (
        eventType: MouseEvent,
        button: MouseButton | MouseScrollDirection,
        pos: [number, number, number]
    ) => {
        if (textEntryRef !== undefined) {
            if (!textEntryRef.BHasKeyFocus()) {
                removeListener?.();
                return;
            }
            if (eventType == 'wheeled') {
                if (button == 1) {
                    textEntryRef.text = (
                        parseInt(textEntryRef.text) + 1
                    ).toString();
                }
                if (button == -1) {
                    textEntryRef.text = (
                        parseInt(textEntryRef.text) - 1
                    ).toString();
                }
                return;
            }
        }
    };

    // 组件挂载后执行
    onMount(() => {
        textEntryRef?.SetDisableFocusOnMouseDown(false);
    });

    onCleanup(() => {
        textEntryRef == undefined;
        removeListener?.();
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
            text={typeof props.text === 'function' ? props.text() : props.text}
            ontextentrychange={() => {
                props.ontextentrychange?.(textEntryRef?.text);
            }}
            onfocus={() => {
                if (props.number === true) {
                    removeListener = cursor.start(handleClick);
                }
            }}
        ></TextEntry>
    );
};
