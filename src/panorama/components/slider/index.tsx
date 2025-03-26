import { Accessor, Component, onMount } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { console } from '../../utils/console';

interface CSliderProps {
    min?: number;
    max?: number;
    value?: number | Accessor<number>;
    direction?: 'vertical' | 'horizontal';
    onvaluechanged?: Function;
}

const main = css``;

export const CSlider: Component<CSliderProps> = props => {
    let sliderRef: SliderPanel | undefined;

    // 组件挂载后执行
    onMount(() => {
        if (sliderRef) {
            sliderRef.min = props.min || 0;
            sliderRef.max = props.max || 1;
            sliderRef.value =
                typeof props.value === 'function'
                    ? props.value()
                    : props.value || 0;
        }
    });

    return (
        <Slider
            class={`${main}`}
            classList={{
                HorizontalSlider: props.direction === 'horizontal'
            }}
            direction={props.direction || 'vertical'}
            min={props.min}
            max={props.max}
            value={
                typeof props.value === 'function' ? props.value() : props.value
            }
            ref={sliderRef}
            onvaluechanged={e => {
                props.onvaluechanged?.(e.value);
            }}
        ></Slider>
    );
};
