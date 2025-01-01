import xml from 'solid-panorama-all-in-jsx/xml.macro';
import require from '../functions/require';

require()

xml(
    <root>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/panorama-polyfill.js" />
            <include src="file://{resources}/scripts/custom_game/custom_loading_screen.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" />
        </Panel>
    </root>
);
