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

const rootStyle$3 = "rootStyle-b3405de9";
function Shop() {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle$3
    }, null);
    libs.setProp(_el$, "class", rootStyle$3);
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
  const [timer, setTimer] = libs.createSignal(-1);
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
    setTimer(setInterval(() => {
      libs.batch(updateState);
      updateCooldown();
    }, 200));
    libs.onCleanup(() => {
      clearInterval(timer());
      console.log('组件已卸载，定时器已清理');
    });
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

const rootStyle$2 = "rootStyle-b6caf7bb";
function InventoryItem(props) {
  const [selected, setToggleSelected] = libs.createSignal(false);
  const GetItemName = () => Abilities.GetAbilityName(props.ItemEntityIndex);
  const ShowItemTooltip = panel => {};
  const HideItemTooltip = () => {};
  const OnDragStart = (panel, dragCallbacks) => {
    if (props.ItemEntityIndex < 0) return true;
    if (selected()) {
      setToggleSelected(false);
    }
    let displayPanel = $.CreatePanel('DOTAItemImage', $.GetContextPanel(), 'dragImage');
    displayPanel.itemname = GetItemName();
    displayPanel.SetAttributeInt('ItemEntityIndex', props.ItemEntityIndex);
    displayPanel.SetAttributeInt('OwnerEntityIndex', props.UnitEntityIndex);
    displayPanel.SetAttributeInt('b_dragComplete', 0);
    dragCallbacks.displayPanel = displayPanel;
    dragCallbacks.offsetX = 30;
    dragCallbacks.offsetY = 22;
    panel.AddClass('draggingFrom');
    return true;
  };
  const OnDragEnd = (panel, draggedPanel) => {
    draggedPanel.DeleteAsync(0);
    panel.RemoveClass('draggingFrom');
    panel.RemoveClass('tryingToDrop');
    let b_dragComplete = Boolean(draggedPanel.GetAttributeInt('b_dragComplete', 0));
    let OwnerEntityIndex = draggedPanel.GetAttributeInt('OwnerEntityIndex', 0);
    let ItemEntityIndex = draggedPanel.GetAttributeInt('ItemEntityIndex', 0);
    if (!b_dragComplete) {
      {
        if (Entities.IsRealHero(OwnerEntityIndex)) {
          Game.DropItemAtCursor(OwnerEntityIndex, ItemEntityIndex);
        }
      }
    }
  };
  const OnDragEnter = (panel, draggedPanel) => {
    let draggedItem = draggedPanel.itemname;
    if (draggedItem == null || draggedPanel == panel) {
      return true;
    }
    panel.AddClass('tryingToDrop');
    return true;
  };
  const OnDragLeave = (panel, draggedPanel) => {
    let draggedItem = draggedPanel.itemname;
    if (draggedItem == null || draggedPanel == panel) {
      return true;
    }
    panel.RemoveClass('tryingToDrop');
    return true;
  };
  const OnDragDrop = (panel, draggedPanel) => {
    Boolean(draggedPanel.GetAttributeInt('b_dragComplete', 0));
    let OwnerEntityIndex = draggedPanel.GetAttributeInt('OwnerEntityIndex', 0);
    let ItemEntityIndex = draggedPanel.GetAttributeInt('ItemEntityIndex', 0);
    let draggedItem = ItemEntityIndex;
    if (draggedItem == null) return true;
    draggedPanel.SetAttributeInt('b_dragComplete', 1);
    if (OwnerEntityIndex == props.UnitEntityIndex) {
      const swapOrder = {
        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
        TargetIndex: props.SlotIndex,
        AbilityIndex: draggedItem
      };
      Game.PrepareUnitOrders(swapOrder);
    } else {
      if (Entities.IsRealHero(OwnerEntityIndex)) {
        let order = {
          OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
          TargetIndex: props.UnitEntityIndex,
          AbilityIndex: ItemEntityIndex
        };
        Game.PrepareUnitOrders(order);
      }
    }
    return true;
  };
  if (props.ItemEntityIndex < 0 && selected() == true) {
    setToggleSelected(false);
  }
  return (() => {
    const _el$ = libs.createElement("Panel", {
        draggable: true
      }, null),
      _el$2 = libs.createElement("DOTAItemImage", {
        get itemname() {
          return Abilities.GetAbilityName(props.ItemEntityIndex);
        }
      }, _el$);
    libs.setProp(_el$, "className", `inventoryItem `);
    libs.setProp(_el$, "onDragStart", OnDragStart);
    libs.setProp(_el$, "onDragEnd", OnDragEnd);
    libs.setProp(_el$, "onDragEnter", OnDragEnter);
    libs.setProp(_el$, "onDragLeave", OnDragLeave);
    libs.setProp(_el$, "onDragDrop", OnDragDrop);
    libs.setProp(_el$, "onmouseover", ShowItemTooltip);
    libs.setProp(_el$, "onmouseout", HideItemTooltip);
    libs.setProp(_el$, "onactivate", () => {
      if (GameUI.IsAltDown()) {
        Abilities.PingAbility(props.ItemEntityIndex);
      } else {
        Abilities.ExecuteAbility(props.ItemEntityIndex, Players.GetLocalPlayerPortraitUnit(), false);
      }
    });
    libs.setProp(_el$, "ondblclick", () => {
      Abilities.CreateDoubleTapCastOrder(props.ItemEntityIndex, Players.GetLocalPlayerPortraitUnit());
    });
    libs.effect(_$p => libs.setProp(_el$2, "itemname", Abilities.GetAbilityName(props.ItemEntityIndex), _$p));
    return _el$;
  })();
}
function getItemList() {
  let items = [];
  for (let slot = 0; slot < 9; ++slot) {
    items.push(Entities.GetItemInSlot(Players.GetLocalPlayerPortraitUnit(), slot));
  }
  return items;
}
function Inventory() {
  const [itemList, setItemList] = libs.createSignal(getItemList());
  libs.createEffect(() => {
    const id = GameEvents.Subscribe('dota_inventory_changed', () => {
      setItemList(getItemList());
    });
    return () => {
      GameEvents.Unsubscribe(id);
    };
  });
  const Update = () => {
    setItemList(getItemList());
  };
  const timer = setInterval(Update, Game.GetGameFrameTime());
  libs.onCleanup(() => clearInterval(timer));
  return (() => {
    const _el$3 = libs.createElement("Panel", {
      "class": rootStyle$2,
      hittest: false
    }, null);
    libs.setProp(_el$3, "class", rootStyle$2);
    libs.insert(_el$3, libs.createComponent(libs.Index, {
      get each() {
        return [...Array(9).keys()];
      },
      children: slot => libs.createComponent(InventoryItem, {
        selectItem: true,
        IsInventory: true,
        get SlotIndex() {
          return slot();
        },
        get ItemEntityIndex() {
          return itemList()[slot()];
        },
        get UnitEntityIndex() {
          return Players.GetPlayerHeroEntityIndex(Players.GetLocalPlayer());
        }
      })
    }));
    return _el$3;
  })();
}

const rootStyle$1 = "rootStyle-e9db74b7";
console.log('Lowhud load');
function Lowhud() {
  let root;
  libs.onMount(() => {
    console.log('Created lowhud', rootStyle$1);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": rootStyle$1
    }, null);
    const _ref$ = root;
    typeof _ref$ === "function" ? libs.use(_ref$, _el$) : root = _el$;
    libs.setProp(_el$, "class", rootStyle$1);
    libs.insert(_el$, libs.createComponent(Inventory, {}), null);
    libs.insert(_el$, libs.createComponent(DotaAbilities, {}), null);
    return _el$;
  })();
}

default_ui_config();
const rootStyle = "rootStyle-bd31ed39";
console.log('Main load');
function Main() {
  const [count, setCount] = libs.createSignal(0);
  libs.createEffect(() => {
    console.log(`当前计数: ${count()}`);
  });
  libs.onMount(() => {
    console.log('Created Main3', rootStyle);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
        "class": rootStyle
      }, null),
      _el$2 = libs.createElement("Button", {}, _el$),
      _el$3 = libs.createElement("Label", {
        get text() {
          return `增加:${count()}`;
        }
      }, _el$2);
    libs.setProp(_el$, "class", rootStyle);
    libs.setProp(_el$2, "onactivate", () => setCount(count() + 1));
    libs.insert(_el$, libs.createComponent(libs.Switch, {
      get children() {
        return [libs.createComponent(libs.Match, {
          get when() {
            return count() === 1;
          },
          get children() {
            return libs.createComponent(Shop, {});
          }
        }), libs.createComponent(libs.Match, {
          get when() {
            return count() === 2;
          },
          get children() {
            return libs.createComponent(Lowhud, {});
          }
        })];
      }
    }), null);
    libs.effect(_$p => libs.setProp(_el$3, "text", `增加:${count()}`, _$p));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Main, {}), $('#app'));

exports.Main = Main;
