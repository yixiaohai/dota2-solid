'use strict'; const exports = {}; GameUI.__loadModule('main', exports); const require = GameUI.__require;

var libs = require('./libs.js');

function default_ui_config () {
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_KILLCAM, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_QUICK_STATS, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_TOP_BAR, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_PREGAME_STRATEGYUI, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_FLYOUT_SCOREBOARD, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_GAME_NAME, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_MINIMAP, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_TEAMS, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_HERO_SELECTION_CLOCK, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_ACTION_PANEL, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PANEL, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_SHOP, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_ITEMS, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_QUICKBUY, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_COURIER, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_PROTECT, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_INVENTORY_GOLD, false);
  GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS, true);
}

class UpdateList {
  _indexes = [];
  next(index) {
    return false;
  }
  get length() {
    return this._indexes.length;
  }
  get indexes() {
    return this._indexes;
  }
  update() {
    let index = 0;
    let indexes = this._indexes;
    let len = indexes.length;
    while (this.next(index)) {
      if (index >= len) {
        indexes.push(index);
      }
      index++;
    }
  }
  value(index) {
    return undefined;
  }
  get values() {
    return this._indexes.map(i => this.value(i));
  }
}

const AbilityStyle = "AbilityStyle-cb9ce1de";
console.log('Ability load');
function Ability(props) {
  const [ability, setAbility] = libs.createSignal(-1);
  const [isPassive, setIsPassive] = libs.createSignal(false);
  const [isNotActive, setIsNotActive] = libs.createSignal(false);
  const [canLearn, setCanLearn] = libs.createSignal(false);
  const [maxLevel, setMaxLevel] = libs.createSignal([]);
  let AbilityCooldown;
  console.log('Ability function');
  libs.onMount(() => {
    console.log('Ability onMount');
    function updateState() {
      const currentAbility = props.list.value(props.slot) || -1;
      const _maxLevel = Math.max(0, Abilities.GetMaxLevel(currentAbility));
      const level = Abilities.GetLevel(currentAbility);
      setAbility(currentAbility);
      setIsPassive(Abilities.IsPassive(currentAbility));
      setIsNotActive(!Abilities.IsActivated(currentAbility) || Abilities.GetLevel(currentAbility) <= 0);
      setCanLearn(Entities.GetAbilityPoints(Abilities.GetCaster(currentAbility)) > 0 && Abilities.CanAbilityBeUpgraded(currentAbility) === AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED);
      if (maxLevel().length !== _maxLevel) {
        const list = [];
        for (let i = 0; i < _maxLevel; i++) {
          list.push(i < level);
        }
        setMaxLevel(list);
      } else {
        const list = maxLevel();
        let updateLevel = false;
        for (let i = 0; i < _maxLevel; i++) {
          const enabled = i < level;
          if (list[i] !== enabled) {
            list[i] = enabled;
            updateLevel = true;
          }
        }
        if (updateLevel) {
          setMaxLevel([...list]);
        }
      }
    }
    let cooldownTimer = 0;
    function updateCooldown() {
      if (Abilities.IsCooldownReady(ability())) {
        if (cooldownTimer !== 0) {
          clearInterval(cooldownTimer);
          cooldownTimer = 0;
        }
        AbilityCooldown.visible = false;
      } else if (cooldownTimer === 0) {
        cooldownTimer = setInterval(() => {
          const time = Abilities.GetCooldownTime(ability());
          let percent = time / Abilities.GetCooldownLength(ability());
          if (isNaN(percent) || percent === Infinity) {
            percent = 0;
          }
          AbilityCooldown.style.clip = `radial(50% 50%, 0deg, ${percent * -360}deg)`;
          AbilityCooldown.visible = true;
        }, 0);
      }
    }
    setInterval(() => {
      libs.batch(updateState);
      updateCooldown();
    }, 200);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
        "class": AbilityStyle
      }, null),
      _el$2 = libs.createElement("Panel", {
        "class": "LearnButton"
      }, _el$),
      _el$3 = libs.createElement("Panel", {
        "class": "AbilityImageWrapper",
        hittestchildren: false
      }, _el$),
      _el$4 = libs.createElement("DOTAAbilityImage", {
        get contextEntityIndex() {
          return ability();
        }
      }, _el$3),
      _el$5 = libs.createElement("Panel", {
        "class": "AbilityCooldown"
      }, _el$3);
      libs.createElement("Panel", {
        "class": "AbilityBorder"
      }, _el$3);
      const _el$7 = libs.createElement("Label", {
        "class": "HotKey",
        get text() {
          return Abilities.GetKeybind(ability());
        }
      }, _el$3),
      _el$8 = libs.createElement("Label", {
        "class": "Mana",
        get text() {
          return Abilities.GetManaCost(ability());
        }
      }, _el$3),
      _el$9 = libs.createElement("Panel", {
        "class": "AbilityLevel"
      }, _el$);
    libs.setProp(_el$, "class", AbilityStyle);
    libs.setProp(_el$2, "onactivate", () => {
      Abilities.AttemptToUpgrade(ability());
    });
    libs.setProp(_el$3, "onactivate", () => {
      if (GameUI.IsAltDown()) {
        Abilities.PingAbility(ability());
      } else {
        Abilities.ExecuteAbility(ability(), Players.GetLocalPlayerPortraitUnit(), false);
      }
    });
    libs.setProp(_el$3, "onmouseover", selfPanel => {
      $.DispatchEvent('DOTAShowAbilityTooltipForEntityIndex', selfPanel, Abilities.GetAbilityName(ability()), Players.GetLocalPlayerPortraitUnit());
    });
    libs.setProp(_el$3, "onmouseout", selfPanel => {
      $.DispatchEvent('DOTAHideAbilityTooltip', selfPanel);
    });
    const _ref$ = AbilityCooldown;
    typeof _ref$ === "function" ? libs.use(_ref$, _el$5) : AbilityCooldown = _el$5;
    libs.insert(_el$9, libs.createComponent(libs.Index, {
      get each() {
        return maxLevel();
      },
      children: enabled => {
        return (() => {
          const _el$10 = libs.createElement("Panel", {
            "class": "Level"
          }, null);
          libs.effect(_$p => libs.setProp(_el$10, "className", enabled() ? 'IsActivate' : '', _$p));
          return _el$10;
        })();
      }
    }));
    libs.effect(_p$ => {
      const _v$ = ability() > 0,
        _v$2 = {
          IsPassive: isPassive(),
          IsNotActive: isNotActive(),
          CanLearn: canLearn()
        },
        _v$3 = ability(),
        _v$4 = !isPassive(),
        _v$5 = Abilities.GetKeybind(ability()),
        _v$6 = Abilities.GetManaCost(ability()) > 0,
        _v$7 = Abilities.GetManaCost(ability());
      _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$, "visible", _v$, _p$._v$));
      _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$, "classList", _v$2, _p$._v$2));
      _v$3 !== _p$._v$3 && (_p$._v$3 = libs.setProp(_el$4, "contextEntityIndex", _v$3, _p$._v$3));
      _v$4 !== _p$._v$4 && (_p$._v$4 = libs.setProp(_el$7, "visible", _v$4, _p$._v$4));
      _v$5 !== _p$._v$5 && (_p$._v$5 = libs.setProp(_el$7, "text", _v$5, _p$._v$5));
      _v$6 !== _p$._v$6 && (_p$._v$6 = libs.setProp(_el$8, "visible", _v$6, _p$._v$6));
      _v$7 !== _p$._v$7 && (_p$._v$7 = libs.setProp(_el$8, "text", _v$7, _p$._v$7));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined
    });
    return _el$;
  })();
}
const DotaAbilitiesStyle = "DotaAbilitiesStyle-e1afa20e";
class AbilityList extends UpdateList {
  _abilities = [];
  next(index) {
    return !!this._abilities[index];
  }
  updateFromUnit(unit) {
    const abilities = this._abilities;
    if (!Entities.IsValidEntity(unit)) {
      if (abilities.length > 0) {
        abilities.splice(abilities.length);
        return true;
      }
      return false;
    }
    const count = Entities.GetAbilityCount(unit);
    let lastIndex = 0;
    let update = false;
    for (let i = 0; i < count; i++) {
      const ability = Entities.GetAbility(unit, i);
      if (Entities.IsValidEntity(ability)) {
        if (Abilities.IsHidden(ability) || Abilities.IsAttributeBonus(ability) || Abilities.GetAbilityType(ability) === ABILITY_TYPES.ABILITY_TYPE_ATTRIBUTES) {
          abilities[i] = -1;
          continue;
        }
        if (abilities[i] !== ability) {
          abilities[i] = ability;
          update = true;
        }
        lastIndex = i;
      } else {
        abilities[i] = -1;
      }
    }
    if (update) {
      abilities.splice(lastIndex + 1, abilities.length - lastIndex);
      super.update();
    }
    return update;
  }
  value(index) {
    return this._abilities[index];
  }
  static Create() {
    const [list, setList] = libs.createSignal([]);
    const abilities = new AbilityList();
    function updater(unit) {
      if (abilities.updateFromUnit(unit)) {
        setList([...abilities.indexes]);
      }
    }
    return [list, updater, abilities];
  }
}
function DotaAbilities() {
  let unit = Players.GetLocalPlayerPortraitUnit();
  const [list, updater, abilities] = AbilityList.Create();
  libs.createEffect(() => {
    const id = GameEvents.Subscribe('dota_player_update_query_unit', evt => {
      unit = Players.GetLocalPlayerPortraitUnit();
    });
    return () => {
      GameEvents.Unsubscribe(id);
    };
  });
  libs.createEffect(() => {
    const id = GameEvents.Subscribe('dota_player_update_selected_unit', evt => {
      unit = Players.GetLocalPlayerPortraitUnit();
    });
    return () => {
      GameEvents.Unsubscribe(id);
    };
  });
  libs.onMount(() => {
    setInterval(() => {
      updater(unit);
    }, 200);
  });
  return (() => {
    const _el$11 = libs.createElement("Panel", {
      "class": DotaAbilitiesStyle
    }, null);
    libs.setProp(_el$11, "class", DotaAbilitiesStyle);
    libs.insert(_el$11, libs.createComponent(libs.For, {
      get each() {
        return list();
      },
      children: i => libs.createComponent(Ability, {
        slot: i,
        list: abilities
      })
    }));
    return _el$11;
  })();
}

function CButton({
  text,
  icon,
  color,
  ...props
}) {
  return (() => {
    const _el$ = libs.createElement("Button", {
        "class": "btnStyle"
      }, null),
      _el$2 = libs.createElement("Image", {
        src: icon ? `file://{images}/custom_game/${icon}` : ''
      }, _el$),
      _el$3 = libs.createElement("Label", {
        text: text
      }, _el$);
    libs.setProp(_el$2, "src", icon ? `file://{images}/custom_game/${icon}` : '');
    libs.setProp(_el$2, "visible", !!icon);
    libs.setProp(_el$3, "text", text);
    libs.setProp(_el$3, "visible", !!text);
    libs.effect(_$p => libs.setProp(_el$, "classList", {
      R: color === 'R',
      G: color === 'G',
      B: color === 'B',
      small: props.small === true,
      large: props.large === true
    }, _$p));
    return _el$;
  })();
}

const rootStyle$1 = "rootStyle-b3405de9";
function Shop() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle$1
    }, null);
    libs.setProp(_el$, "class", rootStyle$1);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button A",
      small: true
    }), null);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button B"
    }), null);
    libs.insert(_el$, libs.createComponent(CButton, {
      text: "Button C",
      large: true
    }), null);
    return _el$;
  })();
}

default_ui_config();
const rootStyle = "rootStyle-bd31ed39";
console.log('Main load');
function Main() {
  let root;
  libs.onMount(() => {
    console.log('Created Main', rootStyle);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
        "class": rootStyle
      }, null);
      libs.createElement("Label", {
        text: "test123"
      }, _el$);
    const _ref$ = root;
    typeof _ref$ === "function" ? libs.use(_ref$, _el$) : root = _el$;
    libs.setProp(_el$, "class", rootStyle);
    libs.insert(_el$, libs.createComponent(DotaAbilities, {}), null);
    libs.insert(_el$, libs.createComponent(Shop, {}), null);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Main, {}), $('#app'));

exports.Main = Main;
