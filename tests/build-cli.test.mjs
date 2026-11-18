import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('從目錄連結建置仍拒絕草稿、檢查文字頁並重建正確的 manifest',async t=>{
  const work=await mkdtemp(join(tmpdir(),'atlas-cli-'));
  t.after(()=>rm(work,{recursive:true,force:true,maxRetries:4}));
  const repo=join(work,'repo');
  const alias=join(work,'entry');
  await mkdir(repo);
  for (const name of ['scripts','public','package.json']) {
    await cp(new URL('../'+name,import.meta.url),join(repo,name),{recursive:true});
  }
  await symlink(repo,alias,process.platform==='win32'?'junction':'dir');
  const run=(file,...args)=> {
    const result=spawnSync(process.execPath,[join(alias,'scripts',file+'.mjs'),...args],{cwd:alias,encoding:'utf8'});
    if (result.error) throw result.error;
    return result;
  };
  const dataFile=join(repo,'public','atlas','data.js');
  await writeFile(dataFile,(await readFile(dataFile,'utf8'))+"\nplaces[0].status='draft';\n");
  const blocked=run('validate','--release');
  assert.equal(blocked.status,1);
  assert.match(blocked.stderr,/尚待審閱：castle/);
  assert.match(run('validate').stdout,/通過/);
  const page=join(repo,'public','atlas','places.html');
  await writeFile(page,'舊版');
  const release=spawnSync('npm run build',{cwd:alias,shell:true,encoding:'utf8',windowsHide:true});
  assert.notEqual(release.status,0);
  assert.match(release.stderr,/尚待審閱：castle/);
  assert.equal(await readFile(page,'utf8'),'舊版','正式驗證失敗不得改寫原始文字頁');
  assert.notEqual(run('reading-pages','--check').status,0);
  assert.equal(run('reading-pages').status,0);
  assert.match(await readFile(page,'utf8'),/地方誌與事件/);
  await writeFile(page,(await readFile(page,'utf8')).replace(/\r?\n/g,'\r\n'));
  assert.equal(run('reading-pages','--check').status,0,'既有 CRLF 工作樹的內容應等價');
  const output=join(repo,'dist-demo');
  await mkdir(output);
  await writeFile(join(output,'index.html'),'fixture');
  assert.equal(run('build-manifest','demo').status,0);
  const manifest=JSON.parse(await readFile(join(output,'manifest.json'),'utf8'));
  assert.equal(manifest.edition,'demo');
  assert.match(manifest.files['index.html'],/^[0-9a-f]{64}$/);
  const local=join(repo,'dist-local');
  await mkdir(local);
  await writeFile(join(local,'obsolete.txt'),'old');
  const rebuilt=run('build-local');
  assert.equal(rebuilt.status,0,rebuilt.stderr);
  await assert.rejects(readFile(join(local,'obsolete.txt')),{code:'ENOENT'});
  assert.ok(!Object.hasOwn(JSON.parse(await readFile(join(local,'manifest.json'),'utf8')).files,'obsolete.txt'));
});
