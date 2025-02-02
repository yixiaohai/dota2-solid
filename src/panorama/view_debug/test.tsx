import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';

const rootStyle = css`
    background-color: rgba(0, 0, 0, 0.5);
    width: 600px;
    height: 600px;
    horizontal-align: center;
    vertical-align: middle;

    .test1 {
        flow-children: right-wrap;
    }
`;
export const Test = () => {
    return (
        <Layer
            name="toolcommon"
            type="left"
            onOpen={() => console.log('open')}
            onClose={() => console.log('close')}
        >
            <Panel class={rootStyle}>
                <Panel class="test1">
                    <CButton text="默认" type={2} />
                    <CButton text="禁用" type={2} disabled />
                    <CButton text="红色" type={2} color="red" />
                    <CButton text="橙色" type={2} color="orange" />
                    <CButton text="黄色" type={2} color="yellow" />
                    <CButton text="绿色" type={2} color="green" />
                    <CButton text="青色" type={2} color="cyan" />
                    <CButton text="蓝色" type={2} color="blue" />
                    <CButton text="紫色" type={2} color="purple" />
                    <CButton text="灰色" type={2} color="grey" />
                </Panel>
                <Panel class="test2"></Panel>
            </Panel>
        </Layer>
    );
};
