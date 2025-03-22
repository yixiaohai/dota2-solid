import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import chokidar from 'chokidar';
import color from 'cli-color';

// === 配置常量 ===
const CONFIG = {
    EXCEL_DIR: path.resolve(__dirname, '../excels'),
    KV_OUTPUT_DIR: path.resolve(__dirname, '../addon/game/scripts/npc'),
    JSON_OUTPUT_DIR: path.resolve(__dirname, '../src/panorama/kv'),
    LUA_OUTPUT_DIR: path.resolve(__dirname, '../src/vscripts/kv'),
    LANG_DIR: path.resolve(__dirname, '../addon/game/resource'),
    FILE_EXT: '.xlsx',
    IGNORE_SHEET_NAME: /(^Sheet\d*$|^charts$)/i,
    BLOCK_MARKERS: {
        START: '{',
        END: '}'
    },
    LANG_PATTERN: /#([^#]+)#/
} as const;

// === 类型定义 ===
type LangEntry = Map<string, string>;
type LangData = Map<string, LangEntry>;
type ProcessedBlock = { entries: string[]; hasContent: boolean };

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
    // 新增当前处理的块结构缓存
    private currentSheetBlocks: BlockInfo[] = [];
    private parseCell(cell: unknown): any {
        // 强化空值处理
        if (cell == undefined || cell === '') return ''; // 处理undefined/null/空字符串
        if (typeof cell === 'number') return cell;

        try {
            // 安全转换字符串
            const str = String(cell).trim();
            return str === '' ? '' : this.autoConvertString(str);
        } catch {
            return '';
        }
    }

    private autoConvertString(str: string): string | number {
        // 处理科学计数法
        if (/^[+-]?\d+\.?\d*e[+-]?\d+$/i.test(str)) {
            const num = Number(str);
            return isNaN(num) ? str : num;
        }

        const num = Number(str);
        return isNaN(num) ? str : num;
    }

    detectBlocks(headers: string[]): BlockInfo[] {
        const blocks: BlockInfo[] = [];
        const stack: BlockInfo[] = [];

        headers.forEach((header, index) => {
            const trimmed = header.trim();
            if (trimmed.endsWith(CONFIG.BLOCK_MARKERS.START)) {
                const newBlock: BlockInfo = {
                    name: trimmed.slice(0, -1).trim(),
                    start: index,
                    end: -1,
                    parent: stack[stack.length - 1] || null,
                    children: []
                };
                stack.at(-1)?.children.push(newBlock);
                stack.push(newBlock);
            } else if (trimmed === CONFIG.BLOCK_MARKERS.END) {
                const block = stack.pop();
                if (block) {
                    block.end = index;
                    blocks.push(block);
                }
            }
        });

        this.currentSheetBlocks = blocks; // 缓存当前sheet的块结构
        return blocks;
    }

    private processBlock(
        block: BlockInfo,
        row: string[],
        headers: string[],
        indentLevel: number
    ): ProcessedBlock {
        const indent = '  '.repeat(indentLevel);
        const entries: string[] = [];
        let hasContent = false;
        let pointer = block.start + 1;

        const childResults = block.children
            .sort((a, b) => a.start - b.start)
            .map(child => {
                const beforeEntries = this.processFields(
                    row,
                    headers,
                    pointer,
                    child.start,
                    indentLevel + 1
                );
                pointer = child.end + 1;

                const result = this.processBlock(
                    child,
                    row,
                    headers,
                    indentLevel + 1
                );
                return {
                    entries: [...beforeEntries, ...result.entries],
                    hasContent: result.hasContent
                };
            });

        const remainingEntries = this.processFields(
            row,
            headers,
            pointer,
            block.end,
            indentLevel + 1
        );

        const allEntries = childResults
            .flatMap(r => r.entries)
            .concat(remainingEntries);
        hasContent =
            allEntries.length > 0 || childResults.some(r => r.hasContent);

        if (hasContent) {
            entries.push(
                `${indent}"${this.escape(block.name)}" {`,
                ...allEntries,
                `${indent}}`
            );
        }

        return { entries, hasContent };
    }

    private processFields(
        row: string[],
        headers: string[],
        start: number,
        end: number,
        indentLevel: number
    ): string[] {
        const entries: string[] = [];
        const indent = '  '.repeat(indentLevel);

        for (let i = start; i < end; i++) {
            const value = row[i];
            const key = headers[i];
            if (key && value) {
                entries.push(
                    `${indent}"${this.escape(key)}" "${this.escape(value)}"`
                );
            }
        }

        return entries;
    }

    private processBlockForStructured(
        block: BlockInfo,
        row: any[],
        headers: string[],
        langColumns: Map<number, { lang: string; template: string }>
    ): IntermediateData {
        const result: IntermediateData = {};

        // 精确处理块内字段（跳过开始和结束标记）
        this.processFieldsForStructured(
            result,
            row,
            headers,
            block.start + 1, // 跳过开始标记列
            block.end - 1, // 跳过结束标记列
            langColumns,
            true // 标记为块内处理
        );

        return result;
    }

    private processFieldsForStructured(
        obj: IntermediateData,
        row: any[],
        headers: string[],
        start: number,
        end: number,
        langColumns: Map<number, { lang: string; template: string }>,
        isBlockField = false
    ) {
        // 确保处理范围有效
        const safeEnd = Math.min(end, headers.length - 1, row.length - 1);

        for (let i = start; i <= safeEnd; i++) {
            // 跳过越界索引
            if (i < 0 || i >= headers.length || i >= row.length) continue;

            const value = this.parseCell(row[i]);
            const rawKey = headers[i]?.trim() || '';

            // 清理键名
            const key = rawKey
                .replace(/{|}/g, '')
                .replace(/^[^a-zA-Z_]/g, '_') // 非法开头字符替换
                .replace(/[^\w]/g, '_'); // 特殊字符转下划线

            if (!key || value === '' || langColumns.has(i)) continue;

            // 仅当字段不在其他块中时处理
            if (!this.isFieldInAnyBlock(i) || isBlockField) {
                obj[key] = value;
            }
        }
    }

    private autoConvertValue(value: any): any {
        if (typeof value === 'string') {
            // 转换数字字符串
            const num = Number(value);
            return isNaN(num) ? value : num;
        }
        return value;
    }

    private isFieldInAnyBlock(columnIndex: number): boolean {
        return this.currentSheetBlocks.some(
            b => columnIndex > b.start && columnIndex < b.end && !b.parent // 仅检查顶级块
        );
    }

    parseSheet(data: unknown[][]): {
        kvContent: string | null;
        structuredData: IntermediateData[];
        langData: LangData;
    } {
        console.log('Raw data sample:', data.slice(0, 3)); // 打印前3行数据

        const langData: LangData = new Map();
        const kvEntries: string[] = [];
        const structuredData: IntermediateData[] = [];

        // 强化表头处理
        const rawHeaderRow = data.length > 1 ? data[1] : [];
        const headers = rawHeaderRow.map(h => {
            try {
                const parsed = this.parseCell(h);
                return parsed !== null && parsed !== undefined
                    ? parsed.toString()
                    : '';
            } catch {
                return '';
            }
        });

        const blocks = this.detectBlocks(headers);
        const langColumns = this.detectLangColumns(headers);

        data.slice(2).forEach((rowData, index) => {
            try {
                console.log(`Processing row ${index}:`, rowData);
                const safeRowData = Array.isArray(rowData) ? rowData : [];
                const row = safeRowData.map(cell => this.parseCell(cell));
                // 跳过无效行
                if (
                    !row ||
                    row.length === 0 ||
                    row.every(cell => cell === '')
                ) {
                    console.log(`⚠️ 跳过空行: 第${index + 3}行`);
                    return;
                }

                const rowKey = row[0]?.toString()?.trim();
                if (!rowKey) {
                    console.log(`⚠️ 跳过无效键行: 第${index + 3}行`);
                    return;
                }

                // 处理结构化数据
                const entry: IntermediateData = {};
                this.processFieldsForStructured(
                    entry,
                    row,
                    headers,
                    1,
                    headers.length,
                    langColumns
                );

                blocks
                    .filter(b => !b.parent)
                    .forEach(block => {
                        const blockResult = this.processBlockForStructured(
                            block,
                            row,
                            headers,
                            langColumns
                        );
                        if (Object.keys(blockResult).length > 0) {
                            entry[block.name] = blockResult;
                        }
                    });

                structuredData.push({ [rowKey.toString()]: entry });

                // 处理KV数据
                const strRow = row.map(c => c.toString());
                const normalEntries = headers
                    .map((key, idx) => ({ key, idx, value: strRow[idx] }))
                    .filter(
                        ({ key, idx, value }) =>
                            idx !== 0 &&
                            !blocks.some(b => idx >= b.start && idx <= b.end) &&
                            !langColumns.has(idx) &&
                            key &&
                            value
                    )
                    .map(
                        ({ key, value }) =>
                            `  "${this.escape(key)}" "${this.escape(value)}"`
                    );

                const blockEntries = blocks
                    .filter(b => !b.parent)
                    .flatMap(block => {
                        const result = this.processBlock(
                            block,
                            strRow,
                            headers,
                            1
                        );
                        return result.hasContent ? result.entries : [];
                    });

                langColumns.forEach(({ lang, template }, index) => {
                    const value = strRow[index];
                    if (!value) return;

                    const finalKey = template.replace(/{}/g, _ =>
                        rowKey.toString()
                    );
                    const langMap = langData.get(lang) || new Map();
                    langMap.set(finalKey, value);
                    langData.set(lang, langMap);
                });

                if (normalEntries.length + blockEntries.length > 0) {
                    kvEntries.push(
                        `  "${this.escape(rowKey.toString())}" {\n${[
                            ...normalEntries,
                            ...blockEntries
                        ].join('\n')}\n  }`
                    );
                }
            } catch (e) {
                console.error(`处理第${index + 3}行时发生错误:`, e);
            }
        });

        return {
            kvContent:
                kvEntries.length > 0
                    ? `"XLSXContent"\n{\n${kvEntries.join('\n\n')}\n}`
                    : null,
            structuredData,
            langData
        };
    }

    private detectLangColumns(
        headers: string[]
    ): Map<number, { lang: string; template: string }> {
        return headers.reduce((map, header, index) => {
            const match = header.match(CONFIG.LANG_PATTERN);
            if (match) {
                map.set(index, {
                    lang: match[1].toLowerCase(),
                    template: header.replace(CONFIG.LANG_PATTERN, '').trim()
                });
            }
            return map;
        }, new Map<number, { lang: string; template: string }>());
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
    private static LUA_KEYWORDS = new Set([
        'and',
        'break',
        'do',
        'else',
        'elseif',
        'end',
        'false',
        'for',
        'function',
        'goto',
        'if',
        'in',
        'local',
        'nil',
        'not',
        'or',
        'repeat',
        'return',
        'then',
        'true',
        'until',
        'while'
    ]);

    static toLua(data: IntermediateData[]): string {
        const validEntries = data
            .map(item => {
                const [key, value] = Object.entries(item)[0];
                const formattedValue = this.formatValue(value, 1);
                return formattedValue !== null
                    ? `${this.formatKey(key)} = ${formattedValue}`
                    : null;
            })
            .filter((entry): entry is string => entry !== null);

        return validEntries.length > 0
            ? `return {\n${validEntries.join(',\n')}\n}`
            : '';
    }

    static toJSON(data: IntermediateData[]): string {
        const filteredData = data.filter(item => {
            const entryValue = Object.values(item)[0];
            return entryValue && Object.keys(entryValue).length > 0;
        });

        const combined =
            filteredData.length > 0 ? Object.assign({}, ...filteredData) : null;
        return combined ? JSON.stringify(combined, null, 2) : '';
    }

    private static formatKey(key: string): string {
        const LUA_KEYWORDS = new Set([
            'and',
            'break',
            'do',
            'else' /* ...其他保留字 */
        ]);
        const isValid = /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key);

        return isValid && !LUA_KEYWORDS.has(key.toLowerCase())
            ? key
            : `["${key}"]`;
    }

    private static formatValue(value: any, indentLevel: number): string | null {
        const indent = '  '.repeat(indentLevel);

        // 处理数组
        if (Array.isArray(value)) {
            const items = value
                .map(v => this.formatValue(v, indentLevel + 1))
                .filter((v): v is string => v !== null);

            return items.length > 0
                ? `{\n${items.join(',\n')}\n${'  '.repeat(indentLevel - 1)}}`
                : null;
        }

        // 处理对象
        if (typeof value === 'object' && value !== null) {
            const entries = Object.entries(value as Record<string, any>)
                .map(([k, v]) => {
                    const formattedValue = this.formatValue(v, indentLevel + 1);
                    return formattedValue !== null
                        ? `${this.formatKey(k as string)} = ${formattedValue}`
                        : null;
                })
                .filter((entry): entry is string => entry !== null);

            return entries.length > 0
                ? `{\n${indent}${entries.join(`,\n${indent}`)}\n${'  '.repeat(
                      indentLevel - 1
                  )}}`
                : null;
        }

        // 处理原始类型
        if (value == null) return null;
        if (typeof value === 'string') return `"${value.replace(/"/g, '\\"')}"`;
        return value.toString();
    }
}
// === 主处理器 ===
class KVConverter {
    private parser = new ExcelParser();
    private langData: LangData = new Map();

    constructor() {
        this.setupWatcher();
        console.log(
            `[${color.magenta('excel.ts')}] 👁️  Watching directory: ${
                CONFIG.EXCEL_DIR
            }`
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
            .on('error', err => console.error('❗ Watch error:', err));
    }

    private async processFile(filePath: string) {
        try {
            console.log(
                `[${color.magenta('excel.ts')}] 🔄 Processing: ${path.basename(
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
                const { kvContent, structuredData, langData } =
                    this.parser.parseSheet(data);

                // 生成KV文件
                if (kvContent) {
                    FileSystem.writeFileSync(
                        path.join(CONFIG.KV_OUTPUT_DIR, `${sheetName}.txt`),
                        kvContent
                    );
                    console.log(
                        `[${color.magenta(
                            'excel.ts'
                        )}] 📝 Generated KV: ${sheetName}.txt`
                    );
                }

                // 生成结构化文件
                if (structuredData.length > 0) {
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
                        console.log(`Generated JSON...`);
                    }

                    // Lua
                    const luaContent = FormatGenerator.toLua(structuredData);
                    if (luaContent && luaContent !== '') {
                        FileSystem.writeFileSync(
                            path.join(
                                CONFIG.LUA_OUTPUT_DIR,
                                `${sheetName}.lua`
                            ),
                            luaContent
                        );
                        console.log(`Generated Lua...`);
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
                `❌ Processing failed: ${filePath}`,
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
                )}] 🌐 Generated lang file: addon_${lang}.txt`
            );
        });
    }
}

// === 启动应用 ===
new KVConverter();
