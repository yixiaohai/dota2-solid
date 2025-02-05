import css from 'solid-panorama-all-in-jsx/css.macro';
import { Layer } from '../components/layer';
import { Input } from '../components/input';

const tooldeveloperStyle = css`
    flow-children: down;
    horizontal-align: center;
    vertical-align: center;
    width: 520px;
    height: 520px;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    transform: translateX(0px) translateY(60px);
    opacity: 1;
    transition-property: opacity, transform;
    transition-duration: 0.35s;
    transition-timing-function: ease-in-out;

    &.minimized {
        opacity: 0;
        transform: translateX(-520px) translateY(60px);
    }

    .test1 {
        flow-children: right-wrap;
    }
`;

export const ToolDeveloper = () => {
    return (
        <Layer name="tooldeveloper" class={tooldeveloperStyle} type="left">
            <Label text="Hello World!2" />
            <Input />
        </Layer>
    );
};
