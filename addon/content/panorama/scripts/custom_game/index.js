'use strict'; const exports = {}; GameUI.__loadModule('index', exports); const require = GameUI.__require;

var libs = require('./libs.js');

const btnStyle = "btnStyle-70707fc4";
const CButton = props => {
  return (() => {
    const _el$ = libs.createElement("Button", {
        get ["class"]() {
          return `${btnStyle} ${props.type ? `style${props.type}` : 'style1'} `;
        },
        get style() {
          return props.style;
        }
      }, null),
      _el$2 = libs.createElement("Label", {
        get text() {
          return props.text;
        },
        get style() {
          return {
            backgroundImage: `url('${props.icon}')`,
            fontSize: props.fontsize ? `${props.fontsize}px` : '17px'
          };
        }
      }, _el$);
    libs.setProp(_el$, "onactivate", () => props.onclick?.());
    libs.effect(_p$ => {
      const _v$ = `${btnStyle} ${props.type ? `style${props.type}` : 'style1'} `,
        _v$2 = {
          red: props.color === 'red',
          orange: props.color === 'orange',
          yellow: props.color === 'yellow',
          green: props.color === 'green',
          cyan: props.color === 'cyan',
          blue: props.color === 'blue',
          purple: props.color === 'purple',
          grey: props.color === 'grey',
          block: props.block === true
        },
        _v$3 = props.style,
        _v$4 = !props.disabled,
        _v$5 = props.text,
        _v$6 = !!props.text,
        _v$7 = {
          icon: !!props.icon
        },
        _v$8 = {
          backgroundImage: `url('${props.icon}')`,
          fontSize: props.fontsize ? `${props.fontsize}px` : '17px'
        };
      _v$ !== _p$._v$ && (_p$._v$ = libs.setProp(_el$, "class", _v$, _p$._v$));
      _v$2 !== _p$._v$2 && (_p$._v$2 = libs.setProp(_el$, "classList", _v$2, _p$._v$2));
      _v$3 !== _p$._v$3 && (_p$._v$3 = libs.setProp(_el$, "style", _v$3, _p$._v$3));
      _v$4 !== _p$._v$4 && (_p$._v$4 = libs.setProp(_el$, "enabled", _v$4, _p$._v$4));
      _v$5 !== _p$._v$5 && (_p$._v$5 = libs.setProp(_el$2, "text", _v$5, _p$._v$5));
      _v$6 !== _p$._v$6 && (_p$._v$6 = libs.setProp(_el$2, "visible", _v$6, _p$._v$6));
      _v$7 !== _p$._v$7 && (_p$._v$7 = libs.setProp(_el$2, "classList", _v$7, _p$._v$7));
      _v$8 !== _p$._v$8 && (_p$._v$8 = libs.setProp(_el$2, "style", _v$8, _p$._v$8));
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined,
      _v$4: undefined,
      _v$5: undefined,
      _v$6: undefined,
      _v$7: undefined,
      _v$8: undefined
    });
    return _el$;
  })();
};

exports.CButton = CButton;
