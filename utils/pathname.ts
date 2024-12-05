import path from 'path';
import { fileURLToPath, URL } from 'url';

interface IPathname {
  __filename: string;
  __dirname: string;
}

export const __rootPath = process.cwd();

export const getPathnames = (currentFile: string | URL): IPathname => ({
  // FULL PATH
  __filename: new URL('', currentFile).pathname,
  // NAME ONLY
  filename: path.basename(new URL('', currentFile).pathname).replace('.ts', '').replace('.js', ''),
  // FULL PATH
  __dirname: new URL('.', currentFile).pathname,
  // NAME ONLY
  dirname: path.basename(new URL('.', currentFile).pathname),
});

export const getPathnames2 = (currentFile: string | URL): IPathname => ({
  __filename: fileURLToPath(currentFile),
  __dirname: path.dirname(fileURLToPath(currentFile)),
});
