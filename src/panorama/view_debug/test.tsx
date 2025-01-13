import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';

const rootStyle = css`
    margin-left: 500px;
    background-color: rgba(0, 0, 0, 0.5);
`;
export const Test = () => {
    return (
        <Panel hittest={false} class={rootStyle}>
            <Label
                text="Hello World1!"
                onactivate={() => {
                    layer.close('toolcommon', 'a');
                }}
            />
        </Panel>
    );
};
