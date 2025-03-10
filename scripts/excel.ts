import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import chokidar from 'chokidar';

// === 配置常量 ===
const CONFIG = {
  EXCEL_DIR: path.resolve(__dirname, '../excels'),
  OUTPUT_DIR: path.resolve(__dirname, '../addon/game/scripts/npc'),
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

// === 核心解析器 ===
class ExcelParser {
  private parseCell(cell: unknown): string {
    return cell?.toString().trim() || '';
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

    // 处理子块
    const childResults = block.children
      .sort((a, b) => a.start - b.start)
      .map(child => {
        // 处理子块前字段
        const beforeEntries = this.processFields(
          row,
          headers,
          pointer,
          child.start,
          indentLevel + 1
        );
        pointer = child.end + 1;

        // 递归处理子块
        const result = this.processBlock(child, row, headers, indentLevel + 1);
        return { entries: [...beforeEntries, ...result.entries], hasContent: result.hasContent };
      });

    // 处理剩余字段
    const remainingEntries = this.processFields(
      row,
      headers,
      pointer,
      block.end,
      indentLevel + 1
    );

    // 合并结果
    const allEntries = childResults.flatMap(r => r.entries).concat(remainingEntries);
    hasContent = allEntries.length > 0 || childResults.some(r => r.hasContent);

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
        entries.push(`${indent}"${this.escape(key)}" "${this.escape(value)}"`);
      }
    }
    
    return entries;
  }

  parseSheet(data: unknown[][]): { kvContent: string; langData: LangData } {
    const langData: LangData = new Map();
    const kvEntries: string[] = [];
    
    const headers = (data[1] || []).map(this.parseCell);
    const blocks = this.detectBlocks(headers);
    const langColumns = this.detectLangColumns(headers);

    data.slice(2).forEach(row => {
      const strRow = row.map(this.parseCell);
      const rowKey = strRow[0];
      if (!rowKey) return;

      // 处理普通字段
      const normalEntries = headers
        .map((key, idx) => ({ key, idx, value: strRow[idx] }))
        .filter(({ key, idx, value }) => (
          idx !== 0 &&
          !blocks.some(b => idx >= b.start && idx <= b.end) &&
          !langColumns.has(idx) &&
          key &&
          value
        ))
        .map(({ key, value }) => `  "${this.escape(key)}" "${this.escape(value)}"`);

      // 处理块结构
      const blockEntries = blocks
        .filter(b => !b.parent)
        .flatMap(block => {
          const result = this.processBlock(block, strRow, headers, 1);
		  
          return result.hasContent ? result.entries : [];
        });



      // 处理语言列
      langColumns.forEach(({ lang, template }, index) => {
        const value = strRow[index];
        if (!value) return;

        const finalKey = template.replace(/{}/g, _ => rowKey);
        const langMap = langData.get(lang) || new Map();
        langMap.set(finalKey, value);
        langData.set(lang, langMap);
      });

      if (normalEntries.length + blockEntries.length > 0) {
        kvEntries.push(`  "${this.escape(rowKey)}" {\n${[...normalEntries, ...blockEntries].join('\n')}\n  }`);
      }
    });

    return {
      kvContent: `"XLSXContent"\n{\n${kvEntries.join('\n\n')}\n}`,
      langData
    };
  }

  private detectLangColumns(headers: string[]): Map<number, { lang: string; template: string }> {
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

// === 主处理器 ===
class KVConverter {
  private parser = new ExcelParser();
  private langData: LangData = new Map();

  constructor() {
    this.setupWatcher();
    console.log(`🔍 监听目录: ${CONFIG.EXCEL_DIR}`);
  }

  private setupWatcher() {
    const watcher = chokidar.watch(
      `${CONFIG.EXCEL_DIR}/**/*${CONFIG.FILE_EXT}`,
      {
        ignored: /(^|[\/\\])\../,
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
      console.log(`🔄 处理文件: ${path.basename(filePath)}`);
      const workbook = FileSystem.readWorkbook(filePath);
      this.langData.clear();

      workbook.SheetNames
        .filter(name => !CONFIG.IGNORE_SHEET_NAME.test(name))
        .forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const data = FileSystem.sheetToData(sheet);
          const { kvContent, langData } = this.parser.parseSheet(data);
          
          // 保存KV文件
          FileSystem.writeFileSync(
            path.join(CONFIG.OUTPUT_DIR, `${sheetName}.txt`),
            kvContent
          );
          
          // 合并语言数据
          langData.forEach((entries, lang) => {
            const target = this.langData.get(lang) || new Map();
            entries.forEach((v, k) => target.set(k, v));
            this.langData.set(lang, target);
          });
        });

      this.saveLangFiles();
    } catch (error) {
      console.error(`❌ 处理失败: ${filePath}`, error instanceof Error ? error.message : error);
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
      console.log(`🌐 生成语言文件: addon_${lang}.txt`);
    });
  }
}

// === 启动应用 ===
new KVConverter();