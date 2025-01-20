'use strict'; const exports = {}; GameUI.__loadModule('main_debug', exports); const require = GameUI.__require;

var libs = require('./libs.js');

const MenuStyle = "MenuStyle-1fe11131";
const Menu = props => {
  return (() => {
    const _el$ = libs.createElement("Panel", {
      get ["class"]() {
        return `${MenuStyle} ${props.mode === 'vertical' ? 'vertical' : 'horizontal'} ${props.show ? '' : `minimized`}`;
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
      const _v$ = `${MenuStyle} ${props.mode === 'vertical' ? 'vertical' : 'horizontal'} ${props.show ? '' : `minimized`}`,
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

const [layerData, setLayerData] = libs.createStore([]);
const create = (name, type, shade, shadeClose, onOpen, onClose) => {
  const newData = [...layerData, {
    name: name,
    type: type,
    show: false,
    shade: shade || 0,
    shadeClose: shadeClose || false,
    onOpen: onOpen,
    onClose: onClose
  }];
  setLayerData(newData);
};
const open = (name, type) => {
  console.log('open', name, type);
  const data = layerData;
  let newData = [...data];
  if (type) {
    const data_type = newData.filter(l => l.type === type);
    data_type.forEach(l => {
      const index = newData.findIndex(item => item === l && item.show);
      if (index !== -1) {
        newData[index] = {
          ...newData[index],
          show: false
        };
        if (newData[index].onClose) {
          newData[index].onClose();
        }
      }
    });
  }
  const index = newData.findIndex(l => l.name === name && l.type === type);
  if (index !== -1) {
    newData[index] = {
      ...newData[index],
      show: true
    };
    if (newData[index].onOpen) {
      newData[index].onOpen();
    }
  }
  setLayerData(newData);
};
const close = (name, type) => {
  setLayerData(prevData => prevData.map(l => {
    if (l.name === name && l.type === type) {
      if (l.onClose) {
        l.onClose();
      }
      return {
        ...l,
        show: false
      };
    }
    return l;
  }));
};
const toggle = (name, type) => {
  const state = isOpen(name, type);
  if (state === null) {
    return;
  }
  if (state) {
    close(name, type);
  } else {
    open(name, type);
  }
};
const isOpen = (name, type) => {
  const data = layerData;
  const index = data.findIndex(l => l.name === name && l.type === type);
  if (index !== -1) {
    return data[index].show;
  }
  return false;
};
const shade = (name, type) => {
  const data = layerData;
  const index = data.findIndex(l => l.name === name && l.type === type);
  if (index !== -1) {
    return data[index].shade;
  }
  return 0;
};
const shadeClose = (name, type) => {
  const data = layerData;
  const index = data.findIndex(l => l.name === name && l.type === type);
  if (index !== -1) {
    return data[index].shadeClose;
  }
  return false;
};
const layer = {
  create,
  open,
  close,
  toggle,
  isOpen,
  shade,
  shadeClose
};

const LayerStyle = "LayerStyle-2dfb962a";
const Layer = props => {
  const resolved = libs.children(() => props.children);
  libs.onMount(() => {
    console.log('Created Layer View', props.name, props.type);
    layer.create(props.name, props.type, props.shade, props.shadeClose, props.onOpen, props.onClose);
    const list = resolved.toArray();
    for (const [index, child] of list.entries()) {
      child.SetPanelEvent('onactivate', () => {});
      child.SetHasClass('content', index === list.length - 1);
    }
  });
  return (() => {
    const _el$ = libs.createElement("Panel", {
        get ["class"]() {
          return `${LayerStyle} ${layer.isOpen(props.name, props.type) ? '' : `minimized`}`;
        }
      }, null),
      _el$2 = libs.createElement("Panel", {
        "class": "shade",
        get style() {
          return {
            backgroundColor: `rgba(0, 0, 0, ${layer.shade(props.name, props.type)})`
          };
        },
        get hittest() {
          return layer.shadeClose(props.name, props.type);
        }
      }, _el$);
    libs.insert(_el$, resolved, _el$2);
    libs.setProp(_el$2, "onactivate", () => {
      if (layer.shadeClose(props.name, props.type)) {
        layer.close(props.name, props.type);
      }
    });
    libs.effect(_p$ => {
      const _v$ = `${LayerStyle} ${layer.isOpen(props.name, props.type) ? '' : `minimized`}`,
        _v$2 = {
          backgroundColor: `rgba(0, 0, 0, ${layer.shade(props.name, props.type)})`
        },
        _v$3 = layer.shadeClose(props.name, props.type);
      _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$, "class", _v$, _p$._v$));
      _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$2, "style", _v$2, _p$._v$2));
      _v$3 !== _p$._v$3 && (_p$._v$3 = libs.setProp(_el$2, "hittest", _v$3, _p$._v$3));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });
    return _el$;
  })();
};

const rootStyle = "rootStyle-dacfbb7a";
const Test = () => {
  return libs.createComponent(Layer, {
    name: "toolcommon",
    type: "left",
    onOpen: () => console.log('open'),
    onClose: () => console.log('close'),
    get children() {
      const _el$ = libs.createElement("Panel", {
          "class": rootStyle
        }, null),
        _el$2 = libs.createElement("Panel", {
          "class": "test1"
        }, _el$),
        _el$3 = libs.createElement("Label", {
          text: "Hello World1!"
        }, _el$2);
        libs.createElement("Panel", {
          "class": "test2"
        }, _el$);
      libs.setProp(_el$, "class", rootStyle);
      libs.setProp(_el$3, "onactivate", () => {
        layer.close('toolcommon', 'left');
      });
      return _el$;
    }
  });
};

const Test2 = () => {
  return libs.createComponent(Layer, {
    name: "tooldeveloper",
    type: "left",
    get children() {
      const _el$ = libs.createElement("Panel", {
          hittest: false
        }, null);
        libs.createElement("Label", {
          text: "Hello World!2"
        }, _el$);
      return _el$;
    }
  });
};

function Debug() {
  if (!Game.IsInToolsMode()) {
    return;
  }
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
      layer.toggle('toolcommon', 'left');
    },
    label: '通用工具',
    style: {
      width: '24px',
      height: '24px'
    }
  }, {
    icon: 'file://{resources}/images/custom_game/debug/icon/toolDeveloper.png',
    func: () => {
      layer.toggle('tooldeveloper', 'left');
    },
    label: '开发工具',
    style: {
      width: '24px',
      height: '24px'
    }
  }]);
  libs.onMount(() => {
    console.log('Created Debug View');
    setTimeout(() => {
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
    libs.insert(_el$, libs.createComponent(Test, {}), null);
    libs.insert(_el$, libs.createComponent(Test2, {}), null);
    return _el$;
  })();
}
libs.render(() => libs.createComponent(Debug, {}), $('#app_debug'));

exports.Debug = Debug;
