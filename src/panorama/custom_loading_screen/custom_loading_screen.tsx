import xml from 'solid-panorama-all-in-jsx/xml.macro';
import GameUI from '../expansion/GameUI';

GameUI()

xml(
    <root>
        <scripts>
            <include src="file://{resources}/scripts/custom_game/custom_loading_screen.js" />
        </scripts>
        <Panel class="root" hittest={false}>
            <Panel id="app" />
        </Panel>
    </root>
);
