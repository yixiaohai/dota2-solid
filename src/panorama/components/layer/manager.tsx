import { createStore } from "solid-js/store";

interface LayerState {
    name: string;
    type: string;
    show: boolean;
}

const [layerData, setLayerData] = createStore<LayerState[]>([]);

const create = (name: string, type?: string) => {
    const newData = [
        ...layerData,
        {
            name: name,
            type: type ?? 'default',
            show: true
        }
    ];
    setLayerData(newData);
    console.log('create');
    console.logx(newData);
};

const open = (name: string, type?: string) => {
    const data = layerData;
    const index = data.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        setLayerData(index, 'show', true);
    }

    console.log('open');
    console.logx(data);
};

const close = (name: string, type?: string) => {
    setLayerData(prevData => 
        prevData.map(l => 
            l.name === name && l.type === type ? { ...l, show: false } : l
        )
    );
    console.log('close');
};

const get = (name: string, type?: string) => {
    const data = layerData;
    const index = data.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        return data[index].show;
    }
    return null;
};

interface LayerActions {
    create: (name: string, type?: string) => void;
    open: (name: string, type?: string) => void;
    close: (name: string, type?: string) => void;
    get: (name: string, type?: string) => boolean | null;
}

export const layer: LayerActions = {
    create,
    open,
    close,
    get
};