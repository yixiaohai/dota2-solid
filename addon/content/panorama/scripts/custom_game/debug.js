'use strict'; const exports = {}; GameUI.__loadModule('debug', exports); const require = GameUI.__require;

var libs = require('./libs.js');

const MenuStyle = "MenuStyle-1fe11131";
const Menu = props => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      "class": MenuStyle
    }, null);
    libs.setProp(_el$, "class", MenuStyle);
    libs.insert(_el$, libs.createComponent(libs.For, {
      get each() {
        return props.items;
      },
      children: i => (() => {
        const _el$2 = libs.createElement("Panel", {
            "class": `${MenuStyle} box`
          }, null),
          _el$3 = libs.createElement("Image", {
            get src() {
              return `${i.icon}`;
            },
            get style() {
              return i.style;
            }
          }, _el$2);
        libs.setProp(_el$2, "class", `${MenuStyle} box`);
        libs.setProp(_el$2, "onactivate", () => {
          i.func();
        });
        libs.insert(_el$2, (() => {
          const _c$ = libs.memo(() => !!i.label);
          return () => _c$() && (() => {
            const _el$4 = libs.createElement("Label", {
              get text() {
                return i.label;
              }
            }, null);
            libs.effect(_$p => libs.setProp(_el$4, "text", i.label, _$p));
            return _el$4;
          })();
        })(), null);
        libs.effect(_p$ => {
          const _v$ = `${i.icon}`,
            _v$2 = i.style;
          _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$3, "src", _v$, _p$._v$));
          _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$3, "style", _v$2, _p$._v$2));
          return _p$;
        }, {
          _v$: undefined,
          _v$2: undefined
        });
        return _el$2;
      })()
    }));
    return _el$;
  })();
};

function Debug() {
  if (!Game.IsInToolsMode()) {
    return;
  }
  const [menuItem, setMenuItem] = libs.createStore([{
    icon: 'file://{resources}/images/custom_game/debug/icon/toolCommon.png.vtex',
    func: () => {
      console.log('toolcommon');
    },
    key: 'toolcommon',
    style: {
      width: '24px',
      height: '24px'
    }
  }, {
    icon: 'file://{resources}/images/custom_game/debug/icon/toolDeveloper.png.vtex',
    func: () => {
      console.log('tooldeveloper');
    },
    key: 'tooldeveloper',
    style: {
      width: '28px',
      height: '28px'
    }
  }]);
  libs.onMount(() => {
    console.log('Created Debug View');
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {}, null);
    libs.insert(_el$, libs.createComponent(Menu, {
      items: menuItem,
      mode: "horizontal"
    }));
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Debug, {}), $('#app'));

exports.Debug = Debug;
