import { Component, createSignal } from 'solid-js';
import css from 'solid-panorama-all-in-jsx/css.macro';
import { console } from '../../functions/console';

interface SwitchProps {
    checked?: boolean;
    defaultChecked?: boolean;
    checkedText?: string;
    unCheckedText?: string;
    size?: 'default' | 'small';
    disabled?: boolean;
    onChange?: Function;
    style?: Partial<PanelStyle>;
}

const main = css`
    width: 80px;
    height: 40px;
    background-color: #2c3e50;
    border-radius: 20px;
    transition-property: background-color;
    transition-duration: 0.3s;
    transition-timing-function: ease-in;
    flow-children: right;

    &.active {
        background-color: #27ae60;
    }
    &.active .slider {
        transform: translateX(43px)
    }

    .slider {
        width: 34px;
        height: 34px;
        margin: 3px;
        border-radius: 17px;
        background-color: #ecf0f1;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transform: translateX(0);
        transition-property: transform;
        transition-duration: 0.3s;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
`;

export const CSwitch: Component<SwitchProps> = props => {
    const [active, setActive] = createSignal<boolean>(props.checked ?? false);

    const handleActivate = () => {
        setActive(!active());
    };

    return (
        <Panel
            class={`${main} ${active() ? 'active' : ''}`}
            onactivate={() => {
                handleActivate();
            }}
        >
            <Panel class="slider" />
        </Panel>
    );
};
