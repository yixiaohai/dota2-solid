import css from 'solid-panorama-all-in-jsx/css.macro';
import { CButton } from '../components/button';

const rootStyle = css`
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
`;

export function Shop() {
    return (
        <Panel class={rootStyle}>
            <CButton text="Button A" />
            <CButton text="Button B" />
            <CButton text="Button C" />
        </Panel>
    );
}
