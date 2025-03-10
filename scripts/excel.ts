import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import type { WorkBook, WorkSheet } from 'xlsx';
import chokidar from 'chokidar';

// 配置
const EXCEL_DIR: string = path.resolve(__dirname, '../excels');
const OUTPUT_DIR: string = path.resolve(__dirname, '../addon/game/scripts/npc');
const LANG_DIR: string = path.resolve(__dirname, '../addon/game/resource');
const FILE_EXT: string = '.xlsx';

// 确保输出目录存在
const ensureDir = (dir: string): void => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const escapeQuotes = (str: string): string => str.replace(/"/g, '\\"');

const processCell = (cell: any): string => {
  return cell?.toString().trim() || '';
};

const processSheetData = (
  data: any[][]
): { kvContent: string; langEntries: Map<string, Map<string, string>> } => {
  const kvEntries: string[] = [];
  const langMap = new Map<string, Map<string, string>>();

  // 处理表头
  const headerRow = (data[1] || []).map(processCell);

  // 识别语言列（格式：#xxx#{}_key）
  const langColumns = headerRow.reduce((acc, cell, index) => {
    const match = cell.match(/#(.+?)#/);
    if (match) {
      const lang = match[1].toLowerCase();
      acc.set(index, {
        lang,
        template: cell.replace(/#.+?#/, '') // 移除非模板部分
      });
    }
    return acc;
  }, new Map<number, { lang: string; template: string }>());

  // 处理数据行
  for (let rowIdx = 2; rowIdx < data.length; rowIdx++) {
    const rawRow = data[rowIdx] || [];
    const row = rawRow.map(processCell);
    if (row.length === 0) continue;

    const entries: string[] = [];
    const rowKey = processCell(rawRow[0]);

    // 处理普通列
    headerRow.slice(1).forEach((key, idx) => {
      const colIndex = idx + 1;
      if (langColumns.has(colIndex)) return;

      const value = row[colIndex];
      if (!value) return;

      entries.push(/^{.*}$/.test(value)
        ? `  "${escapeQuotes(key)}" ${value.slice(1, -1)}`
        : `  "${escapeQuotes(key)}" "${escapeQuotes(value)}"`
      );
    });

    if (entries.length > 0) {
      kvEntries.push(`  "${escapeQuotes(rowKey)}" {\n${entries.join('\n')}\n  }`);
    }

    // 处理语言列（带覆盖逻辑）
    langColumns.forEach(({ lang, template }, colIndex) => {
      const value = row[colIndex];
      if (!value) return;

      // 生成唯一键（强制要求模板包含{}）
      const finalKey = template.includes('{}')
        ? template.replace(/{}/g, rowKey)
        : `${rowKey}_${template}`;

      if (!langMap.has(lang)) {
        langMap.set(lang, new Map());
      }
      
      // 直接覆盖旧值
      langMap.get(lang)!.set(finalKey, value);
    });
  }

  return { kvContent: `"XLSXContent"\n{\n${kvEntries.join('\n\n')}\n}`, langEntries: langMap };
};

const updateLangFiles = (langMap: Map<string, Map<string, string>>) => {
  langMap.forEach((entries, lang) => {
    if (entries.size === 0) return;

    const langFilePath = path.join(LANG_DIR, `addon_${lang}.txt`);
    const content = [
      '"lang"',
      '{',
      `  "Language" "${lang}"`,
      '  "Tokens"',
      '  {',
      ...Array.from(entries).map(([k, v]) => `    "${escapeQuotes(k)}" "${escapeQuotes(v)}"`),
      '  }',
      '}'
    ].join('\n');

    ensureDir(path.dirname(langFilePath));
    fs.writeFileSync(langFilePath, content);
    console.log(`✅ 生成语言文件：${langFilePath}`);
  });
};

const processExcel = (filePath: string): void => {
  try {
    const workbook: WorkBook = xlsx.readFile(filePath);
    const mergedLangMap = new Map<string, Map<string, string>>();

    workbook.SheetNames
      .filter(sheetName => !/Sheet/i.test(sheetName))
      .forEach(sheetName => {
        const worksheet: WorkSheet = workbook.Sheets[sheetName];
        const data: any[][] = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        
        const { kvContent, langEntries } = processSheetData(data);

        // 合并语言数据（新值覆盖旧值）
        langEntries.forEach((entries, lang) => {
          if (!mergedLangMap.has(lang)) {
            mergedLangMap.set(lang, new Map());
          }
          entries.forEach((v, k) => mergedLangMap.get(lang)!.set(k, v));
        });

        // 写入KV文件
        const outputPath = path.join(OUTPUT_DIR, `${sheetName}.txt`);
        ensureDir(OUTPUT_DIR);
        fs.writeFileSync(outputPath, kvContent);
        console.log(`✅ 生成KV文件：${outputPath}`);
      });

    updateLangFiles(mergedLangMap);
  } catch (error: unknown) {
    console.error(`处理失败 ${filePath}:`, error instanceof Error ? error.message : error);
  }
};

// 文件监听初始化
const watcher = chokidar.watch(`${EXCEL_DIR}/**/*${FILE_EXT}`, {
  ignored: /(^|[\/\\])\../,
  persistent: true,
  ignoreInitial: false
});

watcher
  .on('add', processExcel)
  .on('change', processExcel)
  .on('error', error => console.error('监听错误：', error));

console.log(`👀 监听目录：${EXCEL_DIR}`);