import path, { join } from 'node:path';
import fs from 'fs';
import color from 'cli-color';
import type { Plugin } from 'rollup';

// 需要处理的目录配置
const COPY_DIRS = [
    {
        src: '../src/panorama/maps',
        dest: 'maps' // 目标子目录
    },
    {
        src: '../src/panorama/particles',
        dest: 'particles'
    },
    {
        src: '../src/panorama/materials',
        dest: 'materials'
    }
] as const;
export default function CopyPanoramaAssets(): Plugin {
    let hasRun = false;

    const copyDirectory = (srcRoot: string, destRoot: string) => {
        const traverse = (dir: string) => {
            const files = fs.readdirSync(dir);

            files.forEach(file => {
                const srcPath = path.join(dir, file);
                const relativePath = path.relative(srcRoot, srcPath);
                const destPath = path.join(destRoot, relativePath); // [!code focus:15]
                const stat = fs.statSync(srcPath);

                if (stat.isDirectory()) {
                    if (!fs.existsSync(destPath)) {
                        fs.mkdirSync(destPath, { recursive: true });
                    }
                    traverse(srcPath);
                } else {
                    // 确保目标目录存在
                    const parentDir = path.dirname(destPath);
                    if (!fs.existsSync(parentDir)) {
                        fs.mkdirSync(parentDir, { recursive: true });
                    }

                    fs.copyFileSync(srcPath, destPath);
                    console.log(
                        `[${color.magenta(
                            'rollup-plugin-other.ts'
                        )}] 📦 ${destPath} 已复制`
                    );
                }
            });
        };

        traverse(srcRoot);
    };

    const runCopy = () => {
        const baseDest = join(__dirname, '../addon/content'); // [!code focus]

        COPY_DIRS.forEach(({ src, dest }) => {
            const absSrc = join(__dirname, src);
            const absDest = path.join(baseDest, dest); // [!code focus]

            // 确保基础目录存在
            if (!fs.existsSync(baseDest)) {
                // [!code focus]
                fs.mkdirSync(baseDest, { recursive: true });
            }

            if (!fs.existsSync(absSrc)) {
                console.log(
                    color.yellow(
                        `[${color.magenta(
                            'rollup-plugin-other.ts'
                        )}] ⚠️  源目录不存在: ${absSrc}`
                    )
                );
                return;
            }

            console.log(
                `[${color.magenta(
                    'rollup-plugin-other.ts'
                )}] 🚀 开始复制 ${path.basename(src)} → ${dest}`
            );

            copyDirectory(absSrc, absDest);
        });
    };

    return {
        name: 'copy-panorama-assets',
        buildStart() {
            if (hasRun) return;
            hasRun = true;

            // 监视所有源目录
            COPY_DIRS.forEach(({ src }) => {
                const absPath = join(__dirname, src);
                this.addWatchFile(absPath);
            });

            runCopy();
        },
        watchChange(id) {
            // 当源目录文件变化时自动重新复制
            if (
                COPY_DIRS.some(({ src }) => id.startsWith(join(__dirname, src)))
            ) {
                console.log(
                    color.cyan(
                        `[${color.magenta(
                            'rollup-plugin-other.ts'
                        )}] 🔄 检测到变更，重新复制文件...`
                    )
                );
                runCopy();
            }
        }
    };
}
