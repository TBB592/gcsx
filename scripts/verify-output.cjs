const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const {loadCatalog}=require('./content.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'.output'),items=loadCatalog(path.resolve(process.env.CONTENT_DIR||path.join(root,'../gcsx-content')));
const home=fs.readFileSync(path.join(out,'index.html'),'utf8');
assert.ok(home.includes('学习资料库')&&home.includes('搜索学习资料'),'Homepage missing');
const manifest=JSON.parse(fs.readFileSync(path.join(out,'subjects-manifest.json'),'utf8'));
assert.equal(manifest.length,items.length,'Catalog count mismatch');
for(const item of items){
 const html=fs.readFileSync(path.join(out,item.slug+'.html'),'utf8');assert.ok(html.includes(item.title),'Reader title missing');
 if(item.format==='pdf'){
  assert.deepEqual(fs.readFileSync(path.join(out,item.pdf)),fs.readFileSync(item.sourceFile),'PDF bytes changed');
  const data=manifest.find(s=>s.slug===item.slug);assert.ok(data.pages.length>0,'No preview pages');
  for(const page of data.pages){assert.ok(fs.existsSync(path.join(out,page.src.split('?')[0])),'Preview missing');}
 }
}
assert.ok(home.includes('src="counter.html"'),'Counter URL changed');
assert.ok(!home.includes('南京理工')&&!home.includes('南理工'),'Institution name visible');
console.log('Verified '+items.length+' resource pages, PDFs, preview files, search and counter.');
