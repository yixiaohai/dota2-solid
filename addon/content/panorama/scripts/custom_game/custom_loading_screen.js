'use strict'; const require = GameUI.__require;

function require$1 () {
  const root = $.GetContextPanel();
  const modules = GameUI.__modules = {};
  GameUI.__loadModule = function (name, exports) {
    if (modules[name]) {
      $.Msg(`Reload module: ${name} `, exports ? '👏' : '☠️');
    }
    modules[name] = exports;
  };
  GameUI.__require = function (name) {
    name = name.slice(2, name.length - 3);
    if (!modules[name]) {
      const m = $.CreatePanel('Panel', root, name);
      m.BLoadLayout(`file://{resources}/layout/custom_game/${name}.xml`, false, false);
      $.Msg(`Load module: ${name} `, modules[name] ? '👏' : '☠️');
    }
    return modules[name];
  };
}

class LayerManager {
  layers = [];
  openLayer = {};
  create(name, type) {
    type = type ?? 'default';
    const existingLayer = this.layers.find(layer => layer.name === name && layer.type === type);
    if (existingLayer) {
      console.warn(`Layer with name ${name} and type ${type} already exists.`);
      return false;
    }
    const data = {
      name,
      type,
      show: false
    };
    this.layers.push(data);
    return true;
  }
  open(name, type) {
    type = type ?? 'default';
    const layerToOpen = this.layers.find(layer => layer.name === name && layer.type === type);
    if (!layerToOpen) {
      console.warn(`Layer with name ${name} and type ${type} does not exist.`);
      return false;
    }
    if (this.openLayer[type]) {
      this.close(undefined, type);
    }
    layerToOpen.show = true;
    this.openLayer[type] = layerToOpen;
    return true;
  }
  close(name, type) {
    type = type ?? 'default';
    let layerToClose;
    if (name) {
      layerToClose = this.layers.find(layer => layer.name === name && layer.type === type);
    } else {
      layerToClose = this.openLayer[type];
    }
    if (!layerToClose) {
      console.warn(`Layer to close with type ${type} (and name ${name || 'any'}) not found.`);
      return false;
    }
    layerToClose.show = false;
    this.openLayer[type] = null;
    return true;
  }
}
function layer () {
  GameUI.__layer = new LayerManager();
  const layer = GameUI.__layer;
  layer.create('a1', 'a');
  layer.create('a2', 'a');
  layer.create('a3', 'a');
  layer.open('a1', 'a');
  layer.open('a2', 'a');
}

require$1();
layer();
