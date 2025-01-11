'use strict'; const exports = {}; GameUI.__loadModule('layer_manager', exports); const require = GameUI.__require;

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
function Layer () {
  GameUI.__layer = new LayerManager();
  const layer = GameUI.__layer;
  layer.create('a1', 'a');
  layer.create('a2', 'a');
  layer.create('a3', 'a');
  layer.open('a1', 'a');
  layer.open('a2', 'a');
}

exports.Layer = Layer;
