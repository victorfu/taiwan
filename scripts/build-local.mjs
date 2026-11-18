import { cp, copyFile, mkdir, mkdtemp, rename, rm } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { validateAtlas, validatePeriodNotes, validatePolities } from './validate.mjs';
import * as atlas from '../public/atlas/data.js';
import { polityLayers } from '../public/atlas/polities.js';
import { prepareReadingPages } from './reading-pages.mjs';
import { writeManifest } from './build-manifest.mjs';

validateAtlas(atlas);
validatePeriodNotes(atlas.years, atlas.periodNotes);
validatePolities(atlas.years, polityLayers);
await prepareReadingPages();
const output = fileURLToPath(new URL('../dist-local', import.meta.url));
const source = new URL('../public/', import.meta.url);
const work = await mkdtemp(fileURLToPath(new URL('../.atlas-build-',import.meta.url)));
const staged = join(work,'site');
const previous = join(work,'previous');
let preservePrevious = false;
try {
  await mkdir(staged);
  await cp(new URL('atlas/',source),join(staged,'atlas'),{recursive:true});
  for (const name of ['index.html','index-local.html','favicon.ico']) {
    await copyFile(new URL(name,source),join(staged,name));
  }
  await writeManifest(pathToFileURL(staged+sep),'local-preview');
  try {
    await rename(output,previous);
    preservePrevious = true;
  } catch (error) { if (error.code !== 'ENOENT') throw error; }
  try {
    await rename(staged,output);
    preservePrevious = false;
  } catch (error) {
    if (preservePrevious) {
      await rename(previous,output);
      preservePrevious = false;
    }
    throw error;
  }
} finally {
  if (!preservePrevious) await rm(work,{recursive:true,force:true});
}
console.log('臺灣歷史地圖已建置到 dist-local/');


