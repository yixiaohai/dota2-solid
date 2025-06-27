import { console } from '../../utils/console';
import {
    registerModifier,
    BaseModifier,
    BaseModifierMotionBoth
} from '../../utils/dota_ts_adapter';

@registerModifier()
export class modifier_test2 extends BaseModifier {

    OnCreated(params: object): void {

    }

    DeclareFunctions() {
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS];
    }

    GetModifierPhysicalArmorBonus(): number {
        return 100;
    }
}
