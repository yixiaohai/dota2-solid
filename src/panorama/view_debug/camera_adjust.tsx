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
    height: 800px;
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
        flow-children: down;
        padding: 10px;
    }

    .row_right {
        flow-children: right;
    }

    .row_down {
        flow-children: down;
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

    .input_container {
        flow-children: right;
        width: 130px;
        padding: 10px;
    }

    .input_container Label {
        vertical-align: center;
        margin-right: 5px;
        width: 15px;
    }

    .reset {
        padding: 10px;
    }
`;

let SliderList: SliderPanel | undefined;

const [cameraPosX, setCameracameraPosX] = createSignal('0');
const [cameraPosY, setCameracameraPosY] = createSignal('0');
const [cameraPosZ, setCameracameraPosZ] = createSignal('0');

const [cameraPitch, setCameraPitch] = createSignal(60);
const [cameraYaw, setCameraYaw] = createSignal(
    Math.round(GameUI.GetCameraYaw())
);
const [cameraDistance, setCameraDistance] = createSignal(
    default_ui.camera_distance_get()
);
const [cameraHeightOffset, setCameraHeightOffset] = createSignal(
    Math.round(GameUI.GetCameraLookAtPositionHeightOffset())
);

let timeid: ScheduleID | undefined;
const onOpen = () => {
    timeid = timer.create(() => {
        const pos = GameUI.GetCameraLookAtPosition();
        setCameracameraPosX(pos[0].toFixed(0));
        setCameracameraPosY(pos[1].toFixed(0));
        setCameracameraPosZ(pos[2].toFixed(0));
        return 0;
    });
};

const onClose = () => {
    if (timeid) timer.remove(timeid);
};

export const CameraAdjust = () => {
    return (
        <Layer
            name="camera_adjust"
            type="right"
            class={main}
            onOpen={onOpen}
            onClose={onClose}
        >
            <Panel class="head">
                <Label text="#camera_adjust" />
                <CButton
                    class="button"
                    onactivate={() => {
                        layer.close('camera_adjust', 'right');
                    }}
                />
            </Panel>
            <Panel class="content">
                <Panel class="row_down">
                    <Label text="#postion" />
                    <Panel class="row_right">
                        <Panel class="input_container">
                            <Label text="X:" />
                            <Input
                                text={cameraPosX}
                                number={true}
                                ontextentrychange={(value: string) => {
                                    const v = Math.round(Number(value));
                                    setCameracameraPosX(value);
                                    GameUI.SetCameraTargetPosition(
                                        [
                                            v,
                                            Number(cameraPosY()),
                                            Number(cameraPosZ())
                                        ],
                                        -1
                                    );
                                }}
                            />
                        </Panel>
                        <Panel class="input_container">
                            <Label text="Y:" />
                            <Input
                                text={cameraPosY}
                                number={true}
                                ontextentrychange={(value: string) => {
                                    const v = Math.round(Number(value));
                                    setCameracameraPosY(value);
                                    GameUI.SetCameraTargetPosition(
                                        [
                                            Number(cameraPosX()),
                                            v,
                                            Number(cameraPosZ())
                                        ],
                                        -1
                                    );
                                }}
                            />
                        </Panel>
                        <Panel class="input_container">
                            <Label text="Z:" />
                            <Input
                                text={cameraPosZ}
                                number={true}
                                ontextentrychange={(value: string) => {
                                    const v = Math.round(Number(value));
                                    setCameracameraPosZ(value);
                                    GameUI.SetCameraTargetPosition(
                                        [
                                            Number(cameraPosX()),
                                            Number(cameraPosY()),
                                            v
                                        ],
                                        -1
                                    );
                                }}
                            />
                        </Panel>
                    </Panel>
                </Panel>
                <Panel class="row_right">
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
                            number={true}
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
                            number={true}
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
                            number={true}
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
                            number={true}
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
                <Panel class="reset">
                    <CButton
                        text="#reset"
                        flow
                        color="cyan"
                        onactivate={() => {
                            setCameraPitch(60);
                            setCameraYaw(0);
                            setCameraDistance(
                                default_ui.camera_distance_default_get()
                            );
                            setCameraHeightOffset(0);
                        }}
                    />
                </Panel>
            </Panel>
        </Layer>
    );
};
