import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Plugin } from 'rollup';

const xmlFile = `<root>
    <Panel hittest="false" >
        <CustomUIElement type="Hud" layoutfile="file://{resources}/layout/custom_game/main.xml" />
    </Panel>
</root>
`;
export default function CreateMain(options?: {}): Plugin {
    console.log('create main')
    return {
        name: 'create-main',
        generateBundle() {
            const xmlPath = join(
                __dirname,
                `../addon/content/panorama/layout/custom_game/custom_ui_manifest.xml`
            );
            writeFile(xmlPath, xmlFile);
        },
    };
}