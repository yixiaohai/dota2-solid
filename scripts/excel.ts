import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import chokidar from 'chokidar';
import color from 'cli-color';

const CONFIG = {
    EXCEL_DIR: path.resolve(__dirname, '../excels'),
    KV_OUTPUT_DIR: path.resolve(__dirname, '../addon/game/scripts/npc'),
    JSON_OUTPUT_DIR: path.resolve(__dirname, '../src/panorama/kv'),
    LUA_OUTPUT_DIR: path.resolve(__dirname, '../src/vscripts/kv'),
    LANG_DIR: path.resolve(__dirname, '../addon/game/resource'),
    FILE_EXT: '.xlsx',
    IGNORE_SHEET_NAME: /(^Sheet\d*$|^charts$)/i,
    LANG_PATTERN: /#([^#]+)#/, // 匹配本地化表头
    INLINE_BLOCK_REGEX: /^"([^"]*)"\s*"([^"]*)"$/i // 匹配单元格嵌套kv
} as const;

type LangEntry = Map<string, string>;
type LangData = Map<string, LangEntry>;

interface BlockInfo {
    name: string;
    start: number;
    end: number;
    parent: BlockInfo | null;
    children: BlockInfo[];
}

interface IntermediateData {
    [key: string]: any;
}

// === 核心解析器 ===
class ExcelParser {
    /**
     * 表头预处理函数（合并块检测、多语言列识别、字段名规范化）
     * @param headers 原始表头数组
     */
    preprocessHeaders(header: unknown[]): {
        blocks: BlockInfo[];
        langColumns: Map<number, { lang: string; template: string }>;
        headers: string[];
    } {
        const blocks: BlockInfo[] = [];
        const stack: BlockInfo[] = [];
        const langColumns = new Map<
            number,
            { lang: string; template: string }
        >();
        const headers: string[] = [];

        header.forEach((rawHeader, index) => {
            const rawKey = String(rawHeader).trim();

            if (rawKey.endsWith('{')) {
                const newBlock: BlockInfo = {
                    name: rawKey.replace(/{/g, '').trim(), // 移除残留的 {
                    start: index,
                    end: -1,
                    parent: stack[stack.length - 1] || null,
                    children: []
                };
                stack.at(-1)?.children.push(newBlock);
                stack.push(newBlock);
            } else if (rawKey === '}') {
                const block = stack.pop();
                if (block) {
                    block.end = index;
                    blocks.push(block);
                }
            }

            // --- 多语言列检测 ---
            const langMatch = rawKey.match(CONFIG.LANG_PATTERN);
            if (langMatch) {
                langColumns.set(index, {
                    lang: langMatch[1].toLowerCase(),
                    template: rawKey.replace(CONFIG.LANG_PATTERN, '').trim()
                });
            } else {
                const keyBefore = rawKey.replace(/{|}/g, ''); // 移除大括号
                const key = keyBefore.replace(/[^\w]/g, '_'); // 替换非法字符
                if (key !== keyBefore) {
                    console.log(
                        `[${color.magenta(
                            'excel.ts'
                        )}] ⚠️ 字段名被修改：${rawKey} -> ${key}`
                    );
                }
                headers[index] = key;
            }
        });

        return { blocks, langColumns, headers };
    }

    // 处理单元格
    private parseCell(cell: unknown): any {
        if (typeof cell === 'object') {
            return cell;
        }

        if (typeof cell === 'number') return cell;

        if (cell == undefined || cell === '') return '';

        const str = String(cell).trim();
        if (str === '') return '';

        // 检测内联块结构 { ... }
        if (str.startsWith('{') && str.endsWith('}')) {
            const content = str.slice(1, -1).trim();
            return this.parseInlineBlock(content);
        }

        // 原有类型转换
        return this.autoConvertString(str);
    }

    // 处理每行
    private processRow(
        obj: IntermediateData,
        row: any[],
        headers: string[],
        start: number,
        end: number,
        langColumns: Map<number, { lang: string; template: string }>,
        blocks: BlockInfo[],
        parent: BlockInfo | null
    ) {
        const safeEnd = Math.min(end, headers.length - 1, row.length - 1);
        const block_key: number[] = [];

        blocks.forEach(block => {
            for (let index = block.start; index < block.end; index++) {
                block_key.push(index);
            }
        });

        for (let i = start; i <= safeEnd; i++) {
            if (
                i < 0 ||
                i >= headers.length ||
                i >= row.length ||
                langColumns.has(i)
            )
                continue;
            if (block_key.includes(i)) continue;
            const key = headers[i];
            if (!key) continue;
            const value = this.parseCell(row[i]);
            if (value === '') continue;

            if (typeof value === 'object') {
                obj[key] = {};
                Object.entries(value).forEach(([k, v]) => {
                    const key_c = String(k);
                    const value_c = String(v);
                    obj[key][key_c] = this.autoConvertString(value_c);
                });
            } else {
                obj[key] = value;
            }
        }

        if (blocks.length > 0) {
            blocks
                .filter(block => block.parent === parent)
                .forEach(block => {
                    obj[block.name] = {};
                    this.processRow(
                        obj[block.name],
                        row,
                        headers,
                        block.start,
                        block.end,
                        langColumns,
                        block.children,
                        block
                    );
                });
        }
    }

    private parseInlineBlock(content: string): Record<string, any> {
        const obj: Record<string, any> = {};
        const lines = content
            .split('\n')
            .map(line => line.trim())
            .filter(line => line);

        lines.forEach(line => {
            // 增强匹配带嵌套结构的行
            const kvMatch = line.match(CONFIG.INLINE_BLOCK_REGEX);

            if (kvMatch) {
                const key = kvMatch[1].trim();
                const value = kvMatch[2].trim();
                if (key && value) {
                    obj[key] = this.autoConvertString(value);
                }
            } else {
                console.error(
                    `[${color.magenta('excel.ts')}] ❌  KV匹配失败 ${line}`
                );
            }
        });
        return obj;
    }

    private autoConvertString(str: string): string | number | boolean {
        // 布尔值检测
        const lowerStr = str.toLowerCase();
        if (lowerStr === 'true') return true;
        if (lowerStr === 'false') return false;

        // 数值检测
        if (/^-?\d+$/.test(str)) return parseInt(str, 10);
        if (/^-?\d+\.\d+$/.test(str)) return parseFloat(str);

        // 默认返回字符串
        return str;
    }

    parseSheet(data: unknown[][]): {
        structuredData: IntermediateData[];
        langData: LangData;
    } {
        const langData: LangData = new Map();
        const kvEntries: string[] = [];
        const structuredData: IntermediateData[] = [];

        const rawHeaderRow = data.length > 1 ? data[1] : [];

        const { blocks, langColumns, headers } =
            this.preprocessHeaders(rawHeaderRow);

        data.slice(2).forEach((rowData, index) => {
            try {
                const safeRowData = Array.isArray(rowData) ? rowData : [];

                const row = safeRowData.map(cell => {
                    return this.parseCell(cell);
                });

                if (
                    !row ||
                    row.length === 0 ||
                    row.every(cell => cell === '')
                ) {
                    return;
                }

                const rowKey = row[0]?.toString()?.trim();
                if (!rowKey) {
                    return;
                }

                const entry: IntermediateData = [];
                this.processRow(
                    entry,
                    row,
                    headers,
                    1,
                    headers.length,
                    langColumns,
                    blocks,
                    null
                );

                if (Object.keys(entry).length > 0) {
                    structuredData.push({ [rowKey.toString()]: entry });
                }

                langColumns.forEach(({ lang, template }, index) => {
                    const value = row[index];
                    if (!value) return;

                    const finalKey = template.replace(/{}/g, _ =>
                        rowKey.toString()
                    );
                    const langMap = langData.get(lang) || new Map();
                    langMap.set(finalKey, value);
                    langData.set(lang, langMap);
                });
            } catch (e) {
                console.error(
                    `[${color.magenta('excel.ts')}] ❌  处理第${
                        index + 3
                    }行时发生错误:`,
                    e
                );
            }
        });

        return {
            structuredData,
            langData
        };
    }

    private escape(str: string): string {
        return str.replace(/"/g, '\\"');
    }
}

// === 文件管理器 ===
class FileSystem {
    static ensureDir(path: string) {
        fs.mkdirSync(path, { recursive: true, mode: 0o755 });
    }

    static writeFileSync(filePath: string, content: string) {
        this.ensureDir(path.dirname(filePath));
        fs.writeFileSync(filePath, content, 'utf8');
    }

    static readWorkbook(path: string): WorkBook {
        return xlsx.readFile(path);
    }

    static sheetToData(sheet: WorkSheet): unknown[][] {
        return xlsx.utils.sheet_to_json(sheet, { header: 1 });
    }
}

// === 格式生成器 ===
class FormatGenerator {
    static toKV(data: IntermediateData[]): string {
        const depth = 1;
        const indent = '    '.repeat(depth);
        let combined = data.reduce((acc, item) => {
            const [key, value] = Object.entries(item)[0];
            acc += `${indent}"${key}" ${this.deepFormatKV(value, depth + 1)}\n`;
            return acc;
        }, '"XLSXContent"\n{\n');
        combined += '}';
        return combined;
    }

    private static deepFormatKV(value: any, depth: number): any {
        if (value && typeof value === 'object') {
            const indent = '    '.repeat(depth);
            let cleanObj = Object.entries(value).reduce((acc, [k, v]) => {
                acc += `${indent}"${k}" ${this.deepFormatKV(v, depth + 1)}\n`;
                return acc;
            }, ` {\n`);
            cleanObj += `${'    '.repeat(depth - 1)}}`;
            return cleanObj;
        }

        return `"${value}"`;
    }
    static toJSON(data: IntermediateData[]): string {
        const combined = data.reduce((acc, item) => {
            const [key, value] = Object.entries(item)[0];
            acc[key] = this.deepFormatJSON(value);
            return acc;
        }, {} as Record<string, any>);

        return JSON.stringify(combined, null, 4);
    }

    private static deepFormatJSON(value: any): any {
        if (value && typeof value === 'object') {
            // 过滤系统字段
            const cleanObj = Object.entries(value).reduce((acc, [k, v]) => {
                acc[k as string] = this.deepFormatJSON(v);
                return acc;
            }, {} as Record<string, any>);
            return Object.keys(cleanObj).length ? cleanObj : undefined;
        }
        // 自动转换数值类型
        if (typeof value === 'string') {
            const num = Number(value);
            return isNaN(num) ? value : num;
        }
        return value;
    }
}
// === 主处理器 ===
class KVConverter {
    private parser = new ExcelParser();
    private langData: LangData = new Map();

    constructor() {
        this.setupWatcher();
        console.log(
            `[${color.magenta('excel.ts')}] 👁️  监听目录: ${CONFIG.EXCEL_DIR}`
        );
    }

    private setupWatcher() {
        const watcher = chokidar.watch(
            `${CONFIG.EXCEL_DIR}/**/*${CONFIG.FILE_EXT}`,
            {
                ignored: [/(^|[\/\\])\../, /~\$.*/],
                persistent: true,
                ignoreInitial: false
            }
        );

        watcher
            .on('add', path => this.processFile(path))
            .on('change', path => this.processFile(path))
            .on('error', err => console.error('❗ 监听错误:', err));
    }

    private async processFile(filePath: string) {
        try {
            console.log(
                `[${color.magenta('excel.ts')}] 🔄 解析: ${path.basename(
                    filePath
                )}`
            );
            const workbook = FileSystem.readWorkbook(filePath);
            this.langData.clear();

            workbook.SheetNames.filter(
                name => !CONFIG.IGNORE_SHEET_NAME.test(name)
            ).forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const data = FileSystem.sheetToData(sheet);
                const { structuredData, langData } =
                    this.parser.parseSheet(data);

                if (structuredData.length > 0) {
                    const kvContent = FormatGenerator.toKV(structuredData);
                    FileSystem.writeFileSync(
                        path.join(CONFIG.KV_OUTPUT_DIR, `${sheetName}.txt`),
                        kvContent
                    );
                    console.log(
                        `[${color.magenta(
                            'excel.ts'
                        )}] 📝 生成 KV: ${sheetName}.txt`
                    );
                    // JSON
                    const jsonContent = FormatGenerator.toJSON(structuredData);
                    if (jsonContent && jsonContent !== '{}') {
                        FileSystem.writeFileSync(
                            path.join(
                                CONFIG.JSON_OUTPUT_DIR,
                                `${sheetName}.json`
                            ),
                            jsonContent
                        );
                        FileSystem.writeFileSync(
                            path.join(
                                CONFIG.LUA_OUTPUT_DIR,
                                `${sheetName}.json`
                            ),
                            jsonContent
                        );
                        console.log(
                            `[${color.magenta(
                                'excel.ts'
                            )}] 📝 生成 Json: ${sheetName}.json`
                        );
                    }
                }

                // 合并语言数据
                langData.forEach((entries, lang) => {
                    const target = this.langData.get(lang) || new Map();
                    entries.forEach((v, k) => target.set(k, v));
                    this.langData.set(lang, target);
                });
            });

            this.saveLangFiles();
        } catch (error) {
            console.error(
                `❌ 处理失败: ${filePath}`,
                error instanceof Error ? error.message : error
            );
        }
    }

    private saveLangFiles() {
        this.langData.forEach((entries, lang) => {
            if (entries.size === 0) return;

            const content = [
                '"lang"',
                '{',
                `  "Language" "${lang}"`,
                '  "Tokens"',
                '  {',
                ...[...entries].map(([k, v]) => `    "${k}" "${v}"`),
                '  }',
                '}'
            ].join('\n');

            FileSystem.writeFileSync(
                path.join(CONFIG.LANG_DIR, `addon_${lang}.txt`),
                content
            );
            console.log(
                `[${color.magenta(
                    'excel.ts'
                )}] 🌐 生成的本地化文件: addon_${lang}.txt`
            );
        });
    }
}

// === 启动应用 ===
new KVConverter();
