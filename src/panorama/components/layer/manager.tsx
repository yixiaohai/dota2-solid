import { createStore } from 'solid-js/store';
import { console } from '../../functions/console';

interface LayerState {
    name: string;
    type?: string;
    show: boolean;
    shade: number;
    shadeClose: boolean;
    onOpen?: () => void;
    onClose?: () => void;
}

const [layerData, setLayerData] = createStore<LayerState[]>([]);

const create = (
    name: string,
    type?: string,
    shade?: number,
    shadeClose?: boolean,
    onOpen?: () => void,
    onClose?: () => void
) => {
    const newData = [
        ...layerData,
        {
            name: name,
            type: type,
            show: false,
            shade: shade || 0,
            shadeClose: shadeClose || false,
            onOpen: onOpen,
            onClose: onClose
        }
    ];
    setLayerData(newData);
};

const open = (name: string, type?: string) => {
    console.log('open', name, type);
    const data = layerData;
    let newData = [...data]; // 创建数组副本

    if (type) {
        const data_type = newData.filter(l => l.type === type);
        data_type.forEach(l => {
            const index = newData.findIndex(item => item === l && item.show);
            if (index !== -1) {
                newData[index] = { ...newData[index], show: false };
                if (newData[index].onClose) {
                    newData[index].onClose();
                }
            }
        });
    }

    const index = newData.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        newData[index] = { ...newData[index], show: true };

        if (newData[index].onOpen) {
            newData[index].onOpen();
        }
    }

    setLayerData(newData); // 更新整个数组
};

const close = (name: string, type?: string) => {
    setLayerData(prevData =>
        prevData.map(l => {
            if (l.name === name && l.type === type) {
                if (l.onClose) {
                    l.onClose();
                }
                return { ...l, show: false };
            }
            return l;
        })
    );
};

const toggle = (name: string, type?: string) => {
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

const isOpen = (name: string, type?: string) => {
    const data = layerData;
    const index = data.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        return data[index].show;
    }
    return false;
};

const shade = (name: string, type?: string) => {
    const data = layerData;
    const index = data.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        return data[index].shade;
    }
    return 0;
};

const shadeClose = (name: string, type?: string) => {
    const data = layerData;
    const index = data.findIndex(l => l.name === name && l.type === type);
    if (index !== -1) {
        return data[index].shadeClose;
    }
    return false;
};

interface LayerActions {
    create: (
        name: string,
        type?: string,
        shade?: number,
        shadeClose?: boolean,
        onOpen?: () => void,
        onClose?: () => void
    ) => void;
    open: (name: string, type?: string) => void;
    close: (name: string, type?: string) => void;
    toggle: (name: string, type?: string) => void;
    isOpen: (name: string, type?: string) => boolean;
    shade: (name: string, type?: string) => number;
    shadeClose: (name: string, type?: string) => boolean;
}

export const layer: LayerActions = {
    create,
    open,
    close,
    toggle,
    isOpen,
    shade,
    shadeClose
};
