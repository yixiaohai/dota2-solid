import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';

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

const collapseItem: CollapseProps['items'] = [
    {
        key: 'test',
        label: 'testlabel',
        children: () => <Panel>
            <Label text={Math.random()} />
        </Panel>
    },
    {
        key: 'test2',
        label: 'testlabel2',
        children: () => <Panel>
            <Label text={Math.random()} />
        </Panel>
    }
];

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
                    <Collapse items={collapseItem}></Collapse>
                    <Collapse items={collapseItem}></Collapse>
                </Panel>
                <Panel class="test2"></Panel>
            </Panel>
        </Layer>
    );
};
