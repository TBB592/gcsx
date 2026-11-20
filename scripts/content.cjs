const fs=require('node:fs'),path=require('node:path');
const reserved=new Set(['index','404','counter','subjects-manifest','deployment-info']);
const types=['courses','course-guide','campus-life'];
function inside(root,relative){
 if(typeof relative!=='string'||!relative||path.isAbsolute(relative)||/^[a-z]:/i.test(relative)||relative.includes('\\')||relative.split('/').includes('..'))throw new Error('Invalid content path: '+relative);
 const base=fs.realpathSync(root),file=path.resolve(base,relative);
 if(!file.startsWith(base+path.sep)||!fs.existsSync(file)||!fs.realpathSync(file).startsWith(base+path.sep))throw new Error('Content path missing or outside root: '+relative);
 if(!fs.statSync(file).isFile())throw new Error('Content path must be a file: '+relative);
 return file;
}
function loadCatalog(root){
 const raw=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8').replace(/^\uFEFF/,''));
 if(!Array.isArray(raw)||raw.length===0)throw new Error('catalog.json must contain at least one resource');
 const seen=new Set(),files=new Set();
 return raw.map(item=>{
  if(!item||typeof item!=='object')throw new Error('Invalid resource');
  const {slug}=item;
  if(typeof slug!=='string'||!/^[a-z][a-z0-9-]{0,79}$/.test(slug))throw new Error('Invalid resource slug');
  if(reserved.has(slug))throw new Error('Reserved resource slug: '+slug);
  if(seen.has(slug))throw new Error('Duplicate resource slug: '+slug);seen.add(slug);
  for(const field of ['title','category','description'])if(typeof item[field]!=='string'||!item[field].trim()||item[field].length>2000)throw new Error('Invalid '+field+': '+slug);
  if(!types.includes(item.type))throw new Error('Invalid type: '+slug);
  if(item.type==='courses'&&!['science','humanities'].includes(item.area))throw new Error('Invalid course area: '+slug);
  const sourceFile=inside(root,item.file),extension=path.extname(sourceFile).toLowerCase();
  if(!['.pdf','.md'].includes(extension))throw new Error('Only PDF and Markdown supported: '+slug);
  if(files.has(sourceFile))throw new Error('Duplicate source file: '+item.file);files.add(sourceFile);
  if(fs.statSync(sourceFile).size>90*1024*1024)throw new Error('Resource exceeds 90 MiB: '+slug);
  const format=extension==='.pdf'?'pdf':'markdown';
  const preview=slug==='engineering-mathematics'?'assets/pages/page':slug==='university-physics-2'?'assets/physics-pages/page':slug==='advanced-mathematics'?'assets/advanced-pages/page':'assets/previews/'+slug+'/page';
  return {slug,title:item.title.trim(),type:item.type,area:item.type==='courses'?item.area:undefined,category:item.category.trim(),description:item.description.trim(),symbol:typeof item.symbol==='string'?item.symbol.slice(0,8):(format==='pdf'?'∑':'↗'),format,sourceFile,file:item.file,pdf:format==='pdf'?'assets/'+slug+'.pdf':undefined,previewPrefix:preview};
 });
}
module.exports={loadCatalog,inside};
