import css from 'solid-panorama-all-in-jsx/css.macro';
import { layer } from '../components/layer/manager';
import { Layer } from '../components/layer';
import { CButton } from '../components/button';
import { Collapse, CollapseProps } from '../components/collapse';
import { dialog } from '../components/dialog';
import { console } from '../utils/console';
import { timer } from '../utils/timer';
import { default_ui, DefaultUIState } from '../components/default_ui';
import { createSignal, For } from 'solid-js';
import { forEach, forIn } from 'lodash';
import { Input } from '../components/input';
import { CSlider } from '../components/slider';

const main = css`
    flow-children: down;
    width: 420px;
    height: 300px;
    horizontal-align: right;
    vertical-align: middle;
    background-color: #181818dd;
    box-shadow: #000000aa 0px 0px 8px 0px;
    opacity: 1;
    transform: translateX(0px) translateY(-100px);
    transition-property: opacity, transform;
    transition-duration: 0.3s;
    transition-timing-function: ease-in;

    .minimized & {
        opacity: 0;
        transform: translateX(400px) translateY(-100px);
    }

    .content {
        width: 100%;
        flow-children: right;
        padding: 10px;
    }

    .slider_container {
        width: 100px;
        flow-children: down;
        padding: 10px;
    }

    .slider_container Slider {
        horizontal-align: center;
    }

    .slider_container Label {
        color: #d5d5d5;
        font-size: 14px;
        margin-bottom: 5px;
        horizontal-align: center;
        text-align: center;
    }
`;

let SliderList: SliderPanel | undefined;

const [cameraPitch, setCameraPitch] = createSignal(60);
const [cameraYaw, setCameraYaw] = createSignal(
    Math.round(GameUI.GetCameraYaw())
);
const [cameraDistance, setCameraDistance] = createSignal(
    default_ui.camera_distance_get() ?? 1134
);
const [cameraHeightOffset, setCameraHeightOffset] = createSignal(
    Math.round(GameUI.GetCameraLookAtPositionHeightOffset())
);

export const CameraAdjust = () => {
    return (
        <Layer name="camera_adjust" type="right" class={main}>
            <Panel class="head">
                <Label text="#camera_adjust" />
                <Button
                    onactivate={() => {
                        layer.close('camera_adjust', 'right');
                    }}
                />
            </Panel>
            <Panel class="content">
                <Panel class="slider_container">
                    <Label text="#pitch" />
                    <CSlider
                        min={1}
                        max={421}
                        value={cameraPitch}
                        onvaluechanged={(value: number) => {
                            const v = Math.round(value);
                            GameUI.SetCameraPitchMin(v);
                            GameUI.SetCameraPitchMax(v);
                            setCameraPitch(v);
                        }}
                    />
                    <Input
                        text={`${cameraPitch()}`}
                        ontextentrychange={(value: string) => {
                            const v = Math.round(Number(value));
                            GameUI.SetCameraPitchMin(v);
                            GameUI.SetCameraPitchMax(v);
                            setCameraPitch(v);
                        }}
                    />
                </Panel>
                <Panel class="slider_container">
                    <Label text="#yaw" />
                    <CSlider
                        min={0}
                        max={361}
                        value={cameraYaw}
                        ref={SliderList}
                        onvaluechanged={(value: number) => {
                            const v = Math.round(value);
                            GameUI.SetCameraYaw(v);
                            setCameraYaw(v);
                        }}
                    />
                    <Input
                        text={`${cameraYaw()}`}
                        ontextentrychange={(value: string) => {
                            const v = Math.round(Number(value));
                            GameUI.SetCameraYaw(v);
                            setCameraYaw(v);
                        }}
                    />
                </Panel>
                <Panel class="slider_container">
                    <Label text="#distance" />
                    <CSlider
                        min={0}
                        max={6000}
                        value={cameraDistance}
                        onvaluechanged={(value: number) => {
                            const v = Math.round(value);
                            default_ui.camera_distance_set(v);
                            GameUI.SetCameraDistance(v);
                            setCameraDistance(v);
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `r_farz ${
                                        v * 2 + cameraHeightOffset() * 2
                                    }`
                                }
                            );
                        }}
                    />
                    <Input
                        text={`${cameraDistance()}`}
                        ontextentrychange={(value: string) => {
                            const v = Number(value);
                            default_ui.camera_distance_set(v);
                            GameUI.SetCameraDistance(v);
                            setCameraDistance(v);
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `r_farz ${
                                        v * 2 + cameraHeightOffset() * 2
                                    }`
                                }
                            );
                        }}
                    />
                </Panel>
                <Panel class="slider_container">
                    <Label text="#height_offset" />
                    <CSlider
                        min={0}
                        max={3000}
                        value={cameraHeightOffset}
                        ref={SliderList}
                        onvaluechanged={(value: number) => {
                            const v = Math.round(value);
                            GameUI.SetCameraLookAtPositionHeightOffset(v);
                            setCameraHeightOffset(v);
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `r_farz ${
                                        cameraDistance() * 2 + v * 2
                                    }`
                                }
                            );
                        }}
                    />
                    <Input
                        text={`${cameraHeightOffset()}`}
                        ontextentrychange={(value: string) => {
                            const v = Math.round(Number(value));
                            GameUI.SetCameraLookAtPositionHeightOffset(v);
                            setCameraHeightOffset(v);
                            GameEvents.SendCustomGameEventToServer(
                                'c2s_console_command',
                                {
                                    command: `r_farz ${
                                        cameraDistance() * 2 + v * 2
                                    }`
                                }
                            );
                        }}
                    />
                </Panel>
            </Panel>
        </Layer>
    );
};
