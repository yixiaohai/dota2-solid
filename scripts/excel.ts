// scripts/excel.ts
import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import chokidar from 'chokidar';

// 配置
const EXCEL_DIR = path.resolve(__dirname, '../excels'); // 根据实际目录结构调整
const OUTPUT_DIR = path.resolve(__dirname, '../addon/game/scripts/npc');
const FILE_EXT = '.xlsx';

// 确保输出目录存在
const ensureDir = (dir: string) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// 处理单个 Excel 文件
const processExcel = (filePath: string) => {
    try {
        const workbook = xlsx.readFile(filePath);

        workbook.SheetNames.filter(sheetName => !/Sheet/i.test(sheetName)) // 过滤 Sheet 表
            .forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

                // 生成纯表名的文件名
                const outputPath = path.join(
                    OUTPUT_DIR,
                    `${sheetName}.txt` // 直接使用工作表名称
                );

                // 转换内容
                const txtContent = data
                    .map((row: any) =>
                        Array.isArray(row) ? row.join('\t') : row
                    )
                    .join('\n');

                // 写入文件
                ensureDir(OUTPUT_DIR);
                fs.writeFileSync(outputPath, txtContent);
                console.log(`✅ 生成：${outputPath}`);
            });
    } catch (error) {
        console.error(`❌ 处理失败 ${filePath}:`, error);
    }
};

const watcher = chokidar.watch(`${EXCEL_DIR}/**/*${FILE_EXT}`, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: false
});

watcher
    .on('add', processExcel)
    .on('change', processExcel)
    .on('error', error => console.error('监听错误：', error));

console.log(`👀 正在监听 Excel 目录：${EXCEL_DIR}`);
