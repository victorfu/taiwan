import { cp, copyFile, mkdir } from 'node:fs/promises';

import { validateAtlas, validatePeriodNotes, validatePolities } from './validate.mjs';
import * as atlas from '../public/atlas/data.js';
import { polityLayers } from '../public/atlas/polities.js';
import { prepareReadingPages } from './reading-pages.mjs';
import { writeManifest } from './build-manifest.mjs';

validateAtlas(atlas);
validatePeriodNotes(atlas.years, atlas.periodNotes);
validatePolities(atlas.years, polityLayers);
await prepareReadingPages();
const output = new URL('../dist-local/', import.meta.url);
const source = new URL('../public/', import.meta.url);
await mkdir(output, { recursive: true });
await cp(new URL('atlas/', source), new URL('atlas/', output), { recursive: true });
for (const name of ['index.html', 'index-local.html']) {
  await copyFile(new URL(name, source), new URL(name, output));
}
await writeManifest(output,'local-preview');
console.log('臺灣歷史地圖已建置到 dist-local/');


