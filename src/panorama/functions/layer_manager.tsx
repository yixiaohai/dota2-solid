interface LayerItem {
    name: string;
    type?: string;
    show?: boolean | false;
}

class LayerManager {
    private layers: LayerItem[] = [];
    private openLayer: { [type: string]: LayerItem | null } = {}; // 用于跟踪当前打开的弹出层类型，初始化为null表示没有打开的层

    // 创建层
    create(name: string, type?: string): boolean {
        type = type ?? 'default';
        const existingLayer = this.layers.find(
            layer => layer.name === name && layer.type === type
        );
        if (existingLayer) {
            console.warn(
                `Layer with name ${name} and type ${type} already exists.`
            );
            return false;
        }
        const data: LayerItem = {
            name,
            type,
            show: false
        };
        this.layers.push(data);
        return true;
    }

    // 打开层
    open(name: string, type?: string): boolean {
        type = type ?? 'default';
        const layerToOpen = this.layers.find(
            layer => layer.name === name && layer.type === type
        );
        if (!layerToOpen) {
            console.warn(
                `Layer with name ${name} and type ${type} does not exist.`
            );
            return false;
        }
        if (this.openLayer[type]) {
            this.close(undefined, type); // 关闭同类型的已打开层
        }
        layerToOpen.show = true;
        this.openLayer[type] = layerToOpen;
        return true;
    }

    // 关闭层
    close(name?: string, type?: string): boolean {
        type = type ?? 'default';
        let layerToClose: LayerItem | null | undefined;
        if (name) {
            layerToClose = this.layers.find(
                layer => layer.name === name && layer.type === type
            );
        } else {
            layerToClose = this.openLayer[type];
        }
        if (!layerToClose) {
            console.warn(
                `Layer to close with type ${type} (and name ${
                    name || 'any'
                }) not found.`
            );
            return false;
        }
        layerToClose.show = false;
        this.openLayer[type] = null; // 清除打开的层记录
        return true;
    }

    get(name: string, type?: string) {
        type = type ?? 'default';
        const layer = this.layers.find(
            layer => layer.name === name && layer.type === type
        );
        return layer?.show ?? false;
    }
}

export default function () {
    GameUI.__layer = new LayerManager();
}
