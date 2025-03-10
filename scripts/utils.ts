import { statSync } from 'fs';
import color from 'cli-color';
import { getGamePath } from 'steam-game-path';
import exp from 'constants';

export function normalizedPath(p: string): string {
    return p.replace(/\\/g, '/');
}

export function fileColor(s: string) {
    return color.green(s);
}

export function isDir(p: string) {
    return statSync(p).isDirectory();
}

export const getDotaPath = async () => {
    const path = getGamePath(570);
    return path?.game?.path;
};
