'use strict'; const exports = {}; GameUI.__loadModule('main_debug', exports); const require = GameUI.__require;

var libs = require('./libs.js');

const MenuStyle$1 = "MenuStyle-1fe11131";
const Menu = props => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      get ["class"]() {
        return `${MenuStyle$1} ${props.mode === 'vertical' ? 'vertical' : 'horizontal'} ${props.show ? '' : `minimized`}`;
      },
      get style() {
        return props.style;
      }
    }, null);
    libs.insert(_el$, libs.createComponent(libs.For, {
      get each() {
        return props.items;
      },
      children: i => (() => {
        const _el$2 = libs.createElement("Panel", {
            "class": "box"
          }, null),
          _el$3 = libs.createElement("Image", {
            get src() {
              return `${i.icon}`;
            },
            get style() {
              return i.style;
            }
          }, _el$2);
        libs.setProp(_el$2, "onactivate", () => {
          i.func();
        });
        libs.effect(_p$ => {
          const _v$3 = i.label,
            _v$4 = `${i.icon}`,
            _v$5 = i.style;
          _v$3 !== _p$._v$3 && (_p$._v$3 = libs.setProp(_el$2, "tooltip_text", _v$3, _p$._v$3));
          _v$4 !== _p$._v$4 && (_p$._v$4 = libs.setProp(_el$3, "src", _v$4, _p$._v$4));
          _v$5 !== _p$._v$5 && (_p$._v$5 = libs.setProp(_el$3, "style", _v$5, _p$._v$5));
          return _p$;
        }, {
          _v$3: undefined,
          _v$4: undefined,
          _v$5: undefined
        });
        return _el$2;
      })()
    }));
    libs.effect(_p$ => {
      const _v$ = `${MenuStyle$1} ${props.mode === 'vertical' ? 'vertical' : 'horizontal'} ${props.show ? '' : `minimized`}`,
        _v$2 = props.style;
      _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$, "class", _v$, _p$._v$));
      _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$, "style", _v$2, _p$._v$2));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });
    return _el$;
  })();
};

const MenuStyle = "MenuStyle-1266a4d3";
const Layer = props => {
  const [show, setShow] = libs.createSignal(false);
  libs.onMount(() => {
    console.log('Created Layer View');
    const layer = GameUI.__layer;
    layer.create(props.name, props.type);
    setShow(layer.get(props.name, props.type));
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
      get ["class"]() {
        return `${MenuStyle} ${show() ? '' : `minimized`}`;
      }
    }, null);
    libs.insert(_el$, () => props.children);
    libs.effect(_$p => libs.setProp(_el$, "class", `${MenuStyle} ${show() ? '' : `minimized`}`, _$p));
    return _el$;
  })();
};

const Test = () => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
        hittest: false
      }, null);
      libs.createElement("Label", {
        text: "Hello World!"
      }, _el$);
    return _el$;
  })();
};

const Test2 = () => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
        hittest: false
      }, null);
      libs.createElement("Label", {
        text: "Hello World!2"
      }, _el$);
    return _el$;
  })();
};

function Debug() {
  if (!Game.IsInToolsMode()) {
    return;
  }
  const layer = GameUI.__layer;
  const [menuShow, setMenuShow] = libs.createSignal(false);
  const [menuItem, setMenuItem] = libs.createStore([{
    icon: 's2r://panorama/images/control_icons/return_to_game_png.vtex',
    func: () => {
      $.DispatchEvent('DOTAHUDShowDashboard');
    },
    label: '返回主界面',
    style: {
      width: '30px',
      height: '30px',
      transform: 'scaleY(-1)'
    }
  }, {
    icon: 's2r://panorama/images/control_icons/gear_png.vtex',
    func: () => {
      $.DispatchEvent('DOTAShowSettingsPopup');
    },
    label: '设置',
    style: {
      width: '26px',
      height: '26px'
    }
  }, {
    icon: 's2r://panorama/images/control_icons/hamburger_png.vtex',
    func: () => {
      $.DispatchEvent('DOTAHUDToggleScoreboard');
    },
    label: '计分板',
    style: {
      width: '27px',
      height: '27px'
    },
    show: false
  }, {
    icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png',
    func: () => {
      console.log('toolcommon');
      layer.open('toolcommon', 'a');
    },
    label: '通用工具',
    style: {
      width: '24px',
      height: '24px'
    }
  }, {
    icon: 'file://{resources}/images/custom_game/debug/icon/toolDeveloper.png',
    func: () => {
      console.log('tooldeveloper');
      layer.open('tooldeveloper', 'a');
    },
    label: '开发工具',
    style: {
      width: '24px',
      height: '24px'
    }
  }]);
  libs.onMount(() => {
    console.log('Created Debug View');
    setInterval(() => {
      setMenuShow(true);
    }, 1500);
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": "root"
    }, null);
    libs.insert(_el$, libs.createComponent(Menu, {
      items: menuItem,
      get show() {
        return menuShow();
      }
    }), null);
    libs.insert(_el$, libs.createComponent(Layer, {
      name: 'toolcommon',
      type: 'a',
      get children() {
        return libs.createComponent(Test, {});
      }
    }), null);
    libs.insert(_el$, libs.createComponent(Layer, {
      name: 'tooldeveloper',
      type: 'a',
      get children() {
        return libs.createComponent(Test2, {});
      }
    }), null);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Debug, {}), $('#app_debug'));

exports.Debug = Debug;
