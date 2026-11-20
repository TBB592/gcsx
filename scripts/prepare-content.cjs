const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),{spawnSync}=require('node:child_process');
const MarkdownIt=require('markdown-it');
const {loadCatalog}=require('./content.cjs');
const root=path.resolve(__dirname,'..'),contentRoot=path.resolve(process.env.CONTENT_DIR||path.join(root,'../gcsx-content'));
const items=loadCatalog(contentRoot),generated=path.join(root,'.generated'),work=path.join(generated,'work'),pages=path.join(generated,'pages'),pub=path.join(pages,'public'),cache=path.join(root,'.cache/pdf-v1');
function clean(dir){const resolved=path.resolve(dir);if(!resolved.startsWith(root+path.sep)||![generated,path.join(root,'.output')].some(p=>resolved===p||resolved.startsWith(p+path.sep)))throw new Error('Unsafe clean path');fs.rmSync(resolved,{recursive:true,force:true});}
clean(generated);fs.mkdirSync(pub,{recursive:true});fs.mkdirSync(work,{recursive:true});fs.mkdirSync(cache,{recursive:true});
function run(command,args,options={}){const result=spawnSync(command,args,{encoding:'utf8',maxBuffer:16*1024*1024,...options});if(result.status!==0||result.error)throw new Error(command+' failed: '+(result.error?.message||result.stderr||result.stdout));return result.stdout;}
function poppler(name){return process.env.PDF_TOOLS?path.join(process.env.PDF_TOOLS,name+(process.platform==='win32'?'.exe':'')):name;}
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
let rendered=0,reused=0;
for(const item of items){
 if(item.format!=='pdf')continue;
 const bytes=fs.readFileSync(item.sourceFile);if(bytes.subarray(0,5).toString()!=='%PDF-')throw new Error('Invalid PDF: '+item.file);
 const hash=sha(bytes),dir=path.join(cache,hash),metaFile=path.join(dir,'complete.json');
 let meta;try{meta=JSON.parse(fs.readFileSync(metaFile,'utf8'));if(!Number.isInteger(meta.count)||meta.count<1||!Array.isArray(meta.files)||meta.files.length!==meta.count)meta=null;else for(const filename of meta.files){if(!/^page-\d+\.png$/.test(filename)||!fs.existsSync(path.join(dir,filename)))meta=null;}}catch{meta=null;}
 if(!meta){
  fs.mkdirSync(dir,{recursive:true});const info=run(poppler('pdfinfo'),[item.sourceFile]);const count=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);if(!count)throw new Error('Cannot read PDF count: '+item.file);
  const prefix=path.join(dir,'page');run(poppler('pdftoppm'),['-r','180','-png',item.sourceFile,prefix]);
  const files=fs.readdirSync(dir).filter(f=>/^page-\d+\.png$/.test(f)).sort((a,b)=>Number(a.match(/\d+/)[0])-Number(b.match(/\d+/)[0]));
  if(files.length!==count)throw new Error('Missing rendered pages: '+item.file);
  meta={count,files};fs.writeFileSync(metaFile,JSON.stringify(meta));rendered++;
 }else reused++;
 const target=path.join(work,path.dirname(item.previewPrefix));fs.mkdirSync(target,{recursive:true});
 for(const file of meta.files)fs.copyFileSync(path.join(dir,file),path.join(target,file));
 const pdf=path.join(work,item.pdf);fs.mkdirSync(path.dirname(pdf),{recursive:true});fs.copyFileSync(item.sourceFile,pdf);
}
fs.mkdirSync(path.join(work,'scripts'),{recursive:true});fs.copyFileSync(path.join(root,'scripts/build-notes.cjs'),path.join(work,'scripts/build-notes.cjs'));fs.cpSync(path.join(root,'templates'),path.join(work,'templates'),{recursive:true});
fs.writeFileSync(path.join(work,'subjects.json'),JSON.stringify(items.map(({sourceFile,file,...item})=>item)));
run(process.execPath,[path.join(work,'scripts/build-notes.cjs')]);
if(fs.existsSync(path.join(work,'assets')))fs.cpSync(path.join(work,'assets'),path.join(pub,'assets'),{recursive:true});fs.mkdirSync(path.join(pub,'assets'),{recursive:true});
for(const dir of ['campus'])fs.cpSync(path.join(root,'assets',dir),path.join(pub,'assets',dir),{recursive:true});
fs.copyFileSync(path.join(root,'assets/qq-group.jpg'),path.join(pub,'assets/qq-group.jpg'));
for(const file of ['reader.js','feedback.js','library.js','counter.html','counter.js','subjects-manifest.json'])fs.copyFileSync(path.join(fs.existsSync(path.join(work,file))?work:root,file),path.join(pub,file));
const md=new MarkdownIt({html:false,linkify:true,typographer:false});
function markdown(source,slug){
 const tokens=md.parse(source,{});
 function visit(tokens){for(const token of tokens){if(token.children)visit(token.children);if(token.type==='link_open'||token.type==='image'){const attr=token.type==='image'?'src':'href',url=token.attrGet(attr);if(url&&!/^(https?:\/\/|mailto:|#)/i.test(url))throw new Error('Relative Markdown attachment/link unsupported in '+slug+': '+url);}}}
 visit(tokens);return '<div v-pre class="markdown-body">\n'+md.renderer.render(tokens,md.options,{})+'\n</div>';
}
function convert(slug,item){
 const html=fs.readFileSync(path.join(work,slug+'.html'),'utf8'),body=html.match(/<body>([\s\S]*)<\/body>/)[1],title=html.match(/<title>(.*?)<\/title>/)[1];
 let frontmatter={title,home:slug==='index',reader:item?.format==='pdf',legacyHtml:body},source='';
 if(item?.format==='markdown'){
  const marker='__STUDY_MARKDOWN_BODY__',at=body.indexOf(marker);if(at<0)throw new Error('Markdown marker missing');
  frontmatter={title,before:body.slice(0,at).replace('<main id="main">',''),after:body.slice(at+marker.length).replace('</main>','')};
  source=markdown(fs.readFileSync(item.sourceFile,'utf8').replace(/^\uFEFF/,''),slug);
 }
 fs.writeFileSync(path.join(pages,slug+'.md'),'---\n'+JSON.stringify(frontmatter)+'\n---\n'+source+'\n');
}
convert('index');for(const item of items)convert(item.slug,item);
fs.writeFileSync(path.join(pub,'deployment-info.json'),JSON.stringify({content:process.env.CONTENT_SHA||'local',code:process.env.GITHUB_SHA||'local',builtAt:new Date().toISOString(),resources:items.length})+'\n');
fs.writeFileSync(path.join(pub,'.nojekyll'),'');
console.log(JSON.stringify({resources:items.length,rendered,reused,pages:items.filter(i=>i.format==='pdf').length}));
