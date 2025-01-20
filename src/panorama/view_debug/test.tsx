import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';

const rootStyle = css`
    background-color: rgba(0, 0, 0, 0.5);
    width: 200px;
    height: 200px;
    horizontal-align: center;
    vertical-align: middle;
`;
export const Test = () => {
    return (
        <Layer name="toolcommon" type="left">
            <Panel class={rootStyle}>
                <Panel class="test1">
                    <Label
                        text="Hello World1!"
                        onactivate={() => {
                            layer.close('toolcommon', 'left');
                        }}
                    />
                </Panel>
                <Panel class="test2"></Panel>
            </Panel>
        </Layer>
    );
};
