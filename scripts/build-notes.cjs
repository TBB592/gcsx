// Build-time helper only. Published pages do not run Node or need a backend.
const fs=require('node:fs');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const subjects=JSON.parse(fs.readFileSync(path.join(root,'subjects.json'),'utf8').replace(/^\uFEFF/,''));
const args=process.argv.slice(2);
function option(key){const i=args.indexOf(key);return i<0?null:args[i+1];}
const sourceRoot=option('--source-root');
const toolDirectory=option('--pdf-tools');
const render=args.includes('--render');
function tool(name){return toolDirectory?path.join(toolDirectory,name+(process.platform==='win32'?'.exe':'')):name;}
function run(name,argv){const r=spawnSync(tool(name),argv,{encoding:'utf8',maxBuffer:8*1024*1024});if(r.error||r.status!==0)throw new Error(`${name} failed: ${r.error?.message||r.stderr}`);return r.stdout;}
function inside(relative){const target=path.resolve(root,relative);if(!target.startsWith(root+path.sep))throw new Error('Path outside project: '+relative);return target;}
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seen=new Set();
for(const s of subjects){
 if(!/^[a-z][a-z0-9-]*$/.test(s.slug)||seen.has(s.slug))throw new Error('Invalid or duplicate subject slug');seen.add(s.slug);
 const pdf=inside(s.pdf);fs.mkdirSync(path.dirname(pdf),{recursive:true});
 if(sourceRoot){const source=path.resolve(sourceRoot,s.source);if(!source.startsWith(path.resolve(sourceRoot)+path.sep))throw new Error('Invalid PDF source');fs.copyFileSync(source,pdf);}
 if(fs.readFileSync(pdf).subarray(0,5).toString()!=='%PDF-')throw new Error('Invalid PDF: '+s.pdf);
 const prefix=inside(s.previewPrefix);fs.mkdirSync(path.dirname(prefix),{recursive:true});
 let count;
 if(render){const info=run('pdfinfo',[pdf]);count=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]);if(!count)throw new Error('Cannot read PDF page count');const stem=path.basename(prefix)+'-';for(const name of fs.readdirSync(path.dirname(prefix))){if(name.startsWith(stem)&&/^\d+\.png$/.test(name.slice(stem.length))){fs.unlinkSync(inside(path.relative(root,path.join(path.dirname(prefix),name))));}}run('pdftoppm',['-r','180','-png',pdf,prefix]);}
 const filePattern=new RegExp('^'+path.basename(prefix).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'-(\\d+)\\.png$');
 const files=fs.readdirSync(path.dirname(prefix)).map(name=>({name,match:name.match(filePattern)})).filter(f=>f.match).sort((a,b)=>Number(a.match[1])-Number(b.match[1]));
 // The render command may leave obsolete pages when a PDF gets shorter. Include
 // only the actual PDF page count; verify one image exists for every page.
 s.pages=files.filter(f=>!count||Number(f.match[1])<=count).map(f=>{const data=fs.readFileSync(path.join(path.dirname(prefix),f.name));if(data.subarray(1,4).toString()!=='PNG')throw new Error('Invalid PNG');return {number:Number(f.match[1]),src:path.posix.join(path.posix.dirname(s.previewPrefix),f.name),width:data.readUInt32BE(16),height:data.readUInt32BE(20)};});
 if(!s.pages.length||s.pages.some((p,i)=>p.number!==i+1)||(count&&s.pages.length!==count))throw new Error('Missing page previews: '+s.title);
 s.bytes=fs.statSync(pdf).size;s.sizeLabel=Math.round(s.bytes/1024)+' KB';
}
const favicon="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23192f46'/%3E%3Ctext x='14' y='45' font-size='44' fill='%23f5f0e6' font-family='serif'%3E%E2%88%91%3C/text%3E%3C/svg%3E";
function top(title,description,reader=false){return `<!doctype html>\n<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#192f46"><title>${esc(title)}</title><link rel="icon" type="image/svg+xml" href="${favicon}"><link rel="stylesheet" href="styles.css?v=20261016-subjects"></head><body><a class="skip-link" href="#main">跳转到正文</a><header class="site-header wrap"><a class="brand" href="./" aria-label="学科学习笔记首页"><span class="brand-mark" aria-hidden="true">∑</span><span>学科学习笔记<small>ACADEMIC NOTES</small></span></a><nav aria-label="主导航">${reader?'<a href="./" aria-label="返回学科首页">返回学科首页</a><a href="./#community">提问交流</a>':'<a href="#notes">学科资料</a><a href="#community">提问交流</a>'}</nav></header><main id="main">`;}
const footer='</main><footer class="site-footer wrap"><span>学科学习笔记 <span class="footer-dot">·</span> 思考与积累</span><span>记录思考，让知识流动。</span></footer></body></html>\n';
function card(s,i){return `<article class="note-card subject-card"${i===0?' id="reader"':''}><div class="note-index" aria-hidden="true">${String(i+1).padStart(2,'0')}<span>${esc(s.symbol)}</span></div><div class="note-copy"><p class="note-label">${esc(s.category)} · 学习资料</p><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><div class="metadata"><span>PDF · ${s.pages.length} 页</span><span>${s.sizeLabel}</span><span>免费阅读</span></div></div><div class="note-actions"><a class="button primary read-subject" href="${s.slug}.html">阅读资料 <span aria-hidden="true">↗</span></a><a class="button secondary" href="${esc(s.pdf)}" download="${esc(s.title)}.pdf">下载 PDF <span aria-hidden="true">↓</span></a></div></article>`;}
const home=top('学科学习笔记 · 多学科资料',subjects.map(s=>s.title).join('、')+'学习资料，选择学科在线阅读或下载 PDF。')+fs.readFileSync(path.join(root,'templates/hero.html'),'utf8')+fs.readFileSync(path.join(root,'templates/community.html'),'utf8')+`<section class="notes-section wrap" id="notes" aria-labelledby="notes-title"><div class="section-heading"><div><p class="eyebrow">SUBJECT LIBRARY</p><h2 id="notes-title">我的学习笔记</h2></div><span class="section-count">${subjects.length} 门学科 · ${subjects.length} 份资料</span></div><div class="collection-summary"><p>选择一门学科，打开对应的学习资料。</p><iframe src="counter.html" title="累计阅览量" width="230" height="28" style="display:block;max-width:100%;border:0" scrolling="no"></iframe></div><div class="subject-grid">${subjects.map(card).join('\n')}</div></section>`+footer;
fs.writeFileSync(path.join(root,'index.html'),home);
for(const s of subjects){
 const switcher=`<nav class="subject-switch" aria-label="切换学科">${subjects.map(other=>`<a href="${other.slug}.html"${other.slug===s.slug?' aria-current="page"':''}>${esc(other.title)}</a>`).join('')}</nav>`;
 const pages=s.pages.map(p=>`<figure class="page-sheet" id="pdf-page-${p.number}"><figcaption>第 ${p.number} 页 / 共 ${s.pages.length} 页 <a href="${p.src}" target="_blank" rel="noopener">打开大图 ↗</a></figcaption><a href="${p.src}" target="_blank" rel="noopener" aria-label="打开第 ${p.number} 页高清大图"><img src="${p.src}" width="${p.width}" height="${p.height}" loading="${p.number===1?'eager':'lazy'}" decoding="async" alt="${esc(s.title)}，第 ${p.number} 页，共 ${s.pages.length} 页"></a></figure>`).join('\n');
 const reader=top(`${s.title} · 学科学习笔记`,s.description,true)+`<section class="reader-intro wrap"><p class="eyebrow">${esc(s.category)} · 学习资料</p><h1>${esc(s.title)}</h1><p class="intro">${esc(s.description)}</p><div class="reader-intro-meta"><div class="metadata"><span>PDF · ${s.pages.length} 页</span><span>${s.sizeLabel}</span><span>免费阅读</span></div><a class="button primary" href="${esc(s.pdf)}" download="${esc(s.title)}.pdf">下载 PDF ↓</a></div>${switcher}</section><section class="reader-section wrap" id="reader" aria-labelledby="reader-title"><div class="section-heading"><h2 id="reader-title">在线阅读</h2><a class="text-link reader-link" href="${esc(s.pdf)}" target="_blank" rel="noopener">独立打开 PDF ↗</a></div><div class="reader-shell"><div class="reader-toolbar"><span><span class="status-dot" aria-hidden="true"></span> ${esc(s.title)} · 网页阅读版</span><span>共 ${s.pages.length} 页</span></div><div class="page-reader"><input type="checkbox" id="reader-zoom" aria-controls="page-stack"><label for="reader-zoom">放大阅读</label><span class="zoom-hint">放大后可左右滑动，或打开单页大图。</span><nav class="page-nav" aria-label="跳转到资料页码">跳至 ${s.pages.map(p=>`<a href="#pdf-page-${p.number}" aria-label="跳到第 ${p.number} 页">${p.number}</a>`).join(' ')}</nav><div class="page-stack" id="page-stack" tabindex="0" role="region" aria-label="${esc(s.title)}逐页预览，可上下滚动阅读">${pages}</div></div></div><p class="reader-hint">网页预览保留原稿排版，支持逐页浏览和放大。需要复制文字或搜索全文时，请下载原始 PDF。</p><p class="community-entry"><a class="text-link" href="./#community">有疑问或建议？加入网站服务群 ↗</a></p></section>`+footer;
 fs.writeFileSync(path.join(root,s.slug+'.html'),reader);
}
fs.writeFileSync(path.join(root,'subjects-manifest.json'),JSON.stringify(subjects.map(({source,...s})=>s),null,2)+'\n');
console.log(`Built ${subjects.length} subjects: `+subjects.map(s=>`${s.title} (${s.pages.length} pages)`).join(', '));


