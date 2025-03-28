// 防止重复加载kv
interface ckv {
    get(name: string): any;
}

class VscriptKV implements ckv {
    private static instance: VscriptKV;
    private data: IntermediateData = [];

    private constructor() {
        this.data['npc_heroes'] = LoadKeyValues('scripts/npc/npc_heroes.txt');
    }

    static getInstance(): VscriptKV {
        if (!this.instance) {
            this.instance = new VscriptKV();
        }
        return this.instance;
    }

    get(name: string): any {
        if (this.data[name]) {
            return this.data[name];
        } else {
            return undefined;
        }
    }
}

export const ckv = VscriptKV.getInstance();
