import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { years, places, events } from '../public/atlas/data.js';

const sha256 = data => createHash('sha256').update(data).digest('hex');

export async function writeManifest(directory, edition) {
  const root = fileURLToPath(directory);
  const files = {};
  const entries = await readdir(root, { recursive:true, withFileTypes:true });
  const paths = entries.filter(entry => entry.isFile())
    .map(entry => relative(root,join(entry.parentPath,entry.name)).split(sep).join('/')).sort();
  for (const name of paths) {
    if (name !== 'manifest.json') files[name] = sha256(await readFile(join(root,name)));
  }
  const { version } = JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
  const manifest = { schemaVersion:1, version, edition, builtAt:new Date().toISOString(),
    revision:sha256(JSON.stringify(files)), coverage:{years, places:places.length, events:events.length}, files };
  await writeFile(new URL('manifest.json',directory), JSON.stringify(manifest,null,2) + '\n');
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  const edition = process.argv[2];
  if (!['demo','release'].includes(edition)) throw new Error('請指定 demo 或 release');
  await writeManifest(new URL(edition === 'demo' ? '../dist-demo/' : '../dist/',import.meta.url),edition);
}
