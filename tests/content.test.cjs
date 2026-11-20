const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {loadCatalog}=require('../scripts/content.cjs');
function fixture(){const root=fs.mkdtempSync(path.join(os.tmpdir(),'study-content-'));fs.mkdirSync(path.join(root,'notes'));fs.writeFileSync(path.join(root,'notes','test.pdf'),'%PDF-test');fs.writeFileSync(path.join(root,'guide.md'),'# 指南\n内容');return root;}
const pdf={slug:'sample-note',title:'测试笔记',type:'courses',area:'science',category:'数学',description:'测试简介',file:'notes/test.pdf'};
function save(root,items){fs.writeFileSync(path.join(root,'catalog.json'),JSON.stringify(items));}
test('minimal readable PDF entry derives legacy-compatible output paths',()=>{const root=fixture();save(root,[pdf]);const [item]=loadCatalog(root);assert.equal(item.pdf,'assets/sample-note.pdf');assert.equal(item.format,'pdf');assert.equal(item.previewPrefix,'assets/previews/sample-note/page');});
test('Markdown guides need no academic area',()=>{const root=fixture();save(root,[{...pdf,slug:'campus-guide',type:'campus-life',area:undefined,file:'guide.md'}]);const [item]=loadCatalog(root);assert.equal(item.format,'markdown');assert.equal(item.area,undefined);});
test('rejects duplicate slugs',()=>{const root=fixture();save(root,[pdf,pdf]);assert.throws(()=>loadCatalog(root),/duplicate/i);});
test('rejects traversal and reserved output routes',()=>{const root=fixture();save(root,[{...pdf,file:'../secret.pdf'}]);assert.throws(()=>loadCatalog(root),/outside|path/i);save(root,[{...pdf,slug:'index'}]);assert.throws(()=>loadCatalog(root),/reserved/i);});
test('rejects invalid course area',()=>{const root=fixture();save(root,[{...pdf,area:'unknown'}]);assert.throws(()=>loadCatalog(root),/area/i);});
test('rejects symlink escapes',()=>{const root=fixture(),outside=fixture();try{fs.symlinkSync(path.join(outside,'guide.md'),path.join(root,'escape.md'));}catch(e){if(e.code==='EPERM')return;throw e;}save(root,[{...pdf,type:'campus-life',file:'escape.md'}]);assert.throws(()=>loadCatalog(root),/outside|path/i);});
