import { console } from '../functions/console';

export default function Precache(context: CScriptPrecacheContext) {
    console.error('Precache');
    console.error(context);
    PrecacheResource(
        'particle',
        'particles/selection/selection_grid_drag.vpcf',
        context
    );
}
