import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export function isMain(meta) {
  if (typeof meta.main === 'boolean') return meta.main;
  return Boolean(process.argv[1]) &&
    realpathSync.native(process.argv[1]) === realpathSync.native(fileURLToPath(meta.url));
}
