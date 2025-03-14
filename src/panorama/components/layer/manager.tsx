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
    console.log(`打开Layer ${name} ${type}`);
    // 1. 使用 store 内置更新方法
    setLayerData(layers => {
        // 2. 创建新数组保持响应性
        const newLayers = [...layers];

        // 3. 关闭同类型层
        newLayers.forEach((layer, index) => {
            if (layer.type === type && layer.show) {
                newLayers[index] = { ...layer, show: false };
                layer.onClose?.();
            }
        });

        // 4. 打开目标层
        const targetIndex = newLayers.findIndex(
            l => l.name === name && l.type === type
        );
        if (targetIndex !== -1) {
            newLayers[targetIndex] = {
                ...newLayers[targetIndex],
                show: true
            };
            newLayers[targetIndex].onOpen?.();
        }

        return newLayers; // 5. 返回新数组触发更新
    });
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
