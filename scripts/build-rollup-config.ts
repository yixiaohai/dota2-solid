import rollupTypescript, {
    RollupTypescriptOptions
} from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import path, { join } from 'node:path';
import babel from '@rollup/plugin-babel';
import { RollupWatchOptions } from 'rollup';
import { existsSync, readdirSync, statSync } from 'node:fs';
import alias from '@rollup/plugin-alias';
import replace from '@rollup/plugin-replace';
import compatiblePanorama from './rollup-plugin-panorama';
import { isDir } from './utils';
import { rollupPluginXML } from './rollup-plugin-xml';
import { rollupPluginScss } from './rollup-plugin-scss';
import { mkdirSync, writeFileSync } from 'fs'; // 导入写文件的模块
import CreateMain from './rollup-plugin-main';
import LoadImage from './rollup-plugin-img';
import color from 'cli-color';
import CopyPanoramaAssets from './rollup-plugin-other';

export default function GetRollupWatchOptions(rootPath: string) {
    // 入口文件夹
    const pages = readdirSync(rootPath).filter(v => {
        const dirPath = path.join(rootPath, v);
        const filePath = path.join(rootPath, `${v}/${v}.tsx`);

        return v !== 'common' && isDir(dirPath) && existsSync(filePath);
    });

    const inputFiles = pages.map(v => {
        return path.join(rootPath, `./${v}/${v}.tsx`);
    });

    console.log(
        pages.map(v => `[${color.magenta('build-rollup-config.ts')}] 👁️  监听目录:${v}`).join('\n')
    );

    const imagesPath = path.join(rootPath, 'images');

    const options: RollupWatchOptions = {
        input: inputFiles,
        output: {
            sourcemap: false,
            dir: 'addon/content/panorama/scripts/custom_game',
            format: 'cjs',
            entryFileNames: `[name].js`,
            chunkFileNames: `[name].js`,
            assetFileNames: `[name].[ext]`,
            manualChunks(id, api) {
                // const u = new URL(id, 'file:');
                if (id.search(/[\\/]common[\\/]/) >= 0) {
                    return 'common';
                }
                if (
                    id.includes('commonjsHelpers.js') ||
                    id.includes('rollupPluginBabelHelpers.js') ||
                    id.search(/[\\/]node_modules[\\/]/) >= 0
                ) {
                    return 'libs';
                }
            }
        },
        plugins: [
            babel({
                comments: false,
                exclude: 'node_modules/**',
                extensions: ['.js', '.ts', '.tsx'],
                babelHelpers: 'bundled',
                presets: [
                    ['@babel/preset-env', { targets: { node: '18.12' } }],
                    '@babel/preset-typescript',
                    [
                        'babel-preset-solid-panorama',
                        {
                            moduleName: 'solid-panorama-runtime',
                            generate: 'universal'
                        }
                    ]
                ],
                plugins: [
                    '@babel/plugin-transform-typescript',
                    'babel-plugin-macros'
                ]
            }),
            alias({
                entries: [
                    {
                        find: '@common/(.*)',
                        replacement: join(__dirname, 'pages/common/$1.ts')
                    }
                ]
            }),
            replace({
                preventAssignment: true,
                'process.env.NODE_ENV': JSON.stringify('production')
                // 'process.env.NODE_ENV': JSON.stringify('development'),
            }),
            // rollupTypescript({
            //     tsconfig: path.join(rootPath, `tsconfig.json`)
            // }),
            commonjs(),
            nodeResolve({ extensions: ['.tsx', '.ts', '.js', '.jsx'] }),
            compatiblePanorama(),
            CreateMain(), // 创建custom_ui_manifest.xml
            rollupPluginXML({
                inputFiles,
                dir: join(
                    __dirname,
                    '../addon/content/panorama/layout/custom_game'
                )
            }),
            rollupPluginScss({
                inputFiles,
                dir: join(
                    __dirname,
                    '../addon/content/panorama/styles/custom_game'
                )
            }),
            LoadImage({ imagesPath }),
            CopyPanoramaAssets()
        ]
    };

    return options;
}
