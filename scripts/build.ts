import chokidar from 'chokidar';
import {
    readdirSync,
    readFileSync,
    statSync,
    existsSync,
    Stats,
    writeFileSync,
    mkdirSync,
    lstatSync,
    realpathSync,
    chmodSync,
    symlinkSync
} from 'fs';
import * as rollup from 'rollup';
import path, { basename, join, resolve } from 'path';
import {
    PreloadTemplates,
    RenderPanoramaXML,
    RenderPanoramaXMLOptions
} from 'dota2-panorama-xml-static-element';
import glob from 'glob';
import { readFile } from 'fs/promises';
import GetRollupWatchOptions from './build-rollup-config';
import { fileColor, getDotaPath, normalizedPath, Panorama } from './utils';
import color from 'cli-color';
import { moveSync, remove } from 'fs-extra';

const rootPath = normalizedPath(path.join(__dirname, '../src/panorama'));

/**
 * 启动Rollup编译
 */
function StartRollup(): void {
    let options: rollup.RollupWatchOptions = GetRollupWatchOptions(rootPath);
    let watcher = rollup.watch(options);

    // 监听错误
    watcher.on('event', async evt => {
        if (evt.code === 'ERROR') {
            const f = normalizedPath(evt.error.loc?.file || '').replace(
                rootPath + '/',
                ''
            );
            console.log(evt);
            console.log(
                Panorama +
                    ' Build Error: ' +
                    color.red(f) +
                    ': ' +
                    color.yellow(evt.error.loc?.line)
            );
            console.log(
                Panorama + ' Build Error: ' + color.red(evt.error.message)
            );
        }
    });

    watcher.on('change', p => {
        console.log(Panorama + ' ✒️  ' + fileColor(path.basename(p)));
    });
}

async function FsLink() {
    const dotaPath = await getDotaPath();
    if (dotaPath === undefined) {
        console.log('No Dota 2 installation found. Addon linking is skipped.');
        return;
    }

    const FolderName = basename(resolve(__dirname, '../'));

    for (const directoryName of ['game', 'content']) {
        const sourcePath = path.resolve(__dirname, '../addon/', directoryName);
        const targetPath = path.join(
            dotaPath,
            directoryName,
            'dota_addons',
            FolderName
        );
        if (existsSync(targetPath)) {
            const isCorrect =
                lstatSync(sourcePath).isSymbolicLink() &&
                realpathSync(sourcePath) === targetPath;
            if (isCorrect) {
                console.log(
                    `[build.ts] Skipping '${sourcePath}' since it is already linked`
                );
                continue;
            } else {
                // 移除目标文件夹的所有内容，
                console.log(
                    `'${targetPath}' is already linked to another directory, removing`
                );
                chmodSync(targetPath, '0755');
                remove(targetPath)
                    .then(() => {
                        console.log('removed target path');
                        moveSync(sourcePath, targetPath);
                        symlinkSync(targetPath, sourcePath, 'junction');
                        console.log(`Linked ${sourcePath} <==> ${targetPath}`);
                    })
                    .catch(err => {
                        console.error('Error removing target path:', err);
                    });
            }
        } else {
            moveSync(sourcePath, targetPath);
            symlinkSync(targetPath, sourcePath, 'junction');
            console.log(`Linked ${sourcePath} <==> ${targetPath}`);
        }
    }
}

/**
 * 任务入口
 */
export default async function TaskPUI() {
    const outputDir = './addon/content/panorama/scripts/custom_game/';
    const layoutDir = './addon/content/panorama/layout/custom_game/';
    const stylesDir = './addon/content/panorama/styles/custom_game/';
    const imagesDir = './addon/content/panorama/images/custom_game/';

    // 如果输出目录和布局目录不存在，则创建它们
    try {
        mkdirSync(outputDir, { recursive: true });
        mkdirSync(layoutDir, { recursive: true });
        mkdirSync(stylesDir, { recursive: true });
        mkdirSync(imagesDir, { recursive: true });
    } catch (error) {
        console.error('Error creating directory:', error);
    }

    FsLink();

    StartRollup();
}

TaskPUI();
