'use strict'; const exports = {}; GameUI.__loadModule('main_debug', exports); const require = GameUI.__require;

var libs = require('./libs.js');

const MenuStyle = "MenuStyle-1fe11131";
const Menu = props => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      get ["class"]() {
        return `${MenuStyle} ${props.show ? '' : `minimized`}`;
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
          const _v$ = i.label,
            _v$2 = `${i.icon}`,
            _v$3 = i.style;
          _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$2, "tooltip_text", _v$, _p$._v$));
          _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$3, "src", _v$2, _p$._v$2));
          _v$3 !== _p$._v$3 && (_p$._v$3 = libs.setProp(_el$3, "style", _v$3, _p$._v$3));
          return _p$;
        }, {
          _v$: undefined,
          _v$2: undefined,
          _v$3: undefined
        });
        return _el$2;
      })()
    }));
    libs.effect(_$p => libs.setProp(_el$, "class", `${MenuStyle} ${props.show ? '' : `minimized`}`, _$p));
    return _el$;
  })();
};

function Debug() {
  if (!Game.IsInToolsMode()) {
    return;
  }
  const [menuShow, setMenuShow] = libs.createSignal(false);
  const [menuItem, setMenuItem] = libs.createStore([{
    icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png',
    func: () => {
      console.log('toolcommon');
    },
    key: 'toolcommon',
    label: '通用工具',
    style: {
      width: '24px',
      height: '24px'
    }
  }, {
    icon: 'file://{resources}/images/custom_game/debug/icon/toolDeveloper.png',
    func: () => {
      console.log('tooldeveloper');
    },
    key: 'tooldeveloper',
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
      "class": 'root'
    }, null);
    libs.insert(_el$, libs.createComponent(Menu, {
      items: menuItem,
      mode: "horizontal",
      get show() {
        return menuShow();
      }
    }));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Debug, {}), $('#app_debug'));

exports.Debug = Debug;
