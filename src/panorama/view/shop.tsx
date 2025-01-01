
import css from 'solid-panorama-all-in-jsx/css.macro';
import { CButton } from '../components/Button';

const rootStyle = css`
    flow-children: right;
    horizontal-align: center;
    vertical-align: bottom;
`;

export function Shop() {
    return (
        <Panel class={rootStyle}>
            <CButton text="Button A" small />
            <CButton text="Button B" />
            <CButton text="Button C" large />
        </Panel>
    );
}


