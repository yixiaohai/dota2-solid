import { reloadable } from '../utils/tstl-utils';
import { console } from '../functions/console';
import { timer } from '../functions/timer';

@reloadable
export class Hero {
    constructor() {}

    remove_hero_owner(hero: CDOTA_BaseNPC_Hero) {
        let ent = Entities.First()
        while (ent != null){
            if (ent.GetOwner() == hero && ent != hero){
                ent.RemoveSelf()
            }
            const ent_next = Entities.Next(ent)
            if (ent_next == null){
                break
            }
            ent = ent_next
        }
    }
    remove_hero(hero: CDOTA_BaseNPC_Hero) {
        this.remove_hero_owner(hero)
        hero.RemoveSelf()
    }
}
