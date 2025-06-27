import { console } from '../../utils/console';
import {
    registerModifier,
    BaseModifier,
    BaseModifierMotionBoth
} from '../../utils/dota_ts_adapter';

@registerModifier()
export class modifier_test extends BaseModifier {
    private value: number = 0;

    OnCreated(params: object): void {
        this.value = this.GetParent().GetPhysicalArmorValue(true) * 0.5;
    }

    DeclareFunctions() {
        return [ModifierFunction.PHYSICAL_ARMOR_BONUS];
    }

    GetModifierPhysicalArmorBonus(): number {
        return this.value;
    }
}
