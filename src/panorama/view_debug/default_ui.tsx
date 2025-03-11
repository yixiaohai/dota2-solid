import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../functions/console';
import { timer } from '../functions/timer';
import { CSwitch } from '../components/switch';

const main = css`
    flow-children: down;
    width: 520px;
    height: 520px;
    horizontal-align: center;
    vertical-align: middle;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    opacity: 1;
    transform: translateX(0px) translateY(-100px);
    transition-property: opacity, pre-transform-scale2d;
    transition-duration: 0.3s;
    transition-timing-function: ease-in;

    .minimized & {
        opacity: 0;
        pre-transform-scale2d: 0.85;
    }

    .content {
    }
`;

export const DefaultUI = () => {
    return (
        <Layer
            name="default_ui"
            type="center"
            class={main}
            shade={0.3}
            shadeClose={true}
        >
            <Panel>
                <Button
                    onactivate={() => {
                        layer.close('default_ui', 'center');
                    }}
                >
                    <Image src="s2r://panorama/images/control_icons/gear_return_png.vtex" />
                </Button>
                <Label text="#default_ui" />
            </Panel>
            <Panel class="content">
                <CSwitch />
            </Panel>
        </Layer>
    );
};
