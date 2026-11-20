const path=require('node:path'),{spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
for(const [command,args] of [[process.execPath,['scripts/prepare-content.cjs']],[process.execPath,['node_modules/vitepress/bin/vitepress.js','build','site']]]){
 const result=spawnSync(command,args,{cwd:root,stdio:'inherit',env:process.env});if(result.status!==0)process.exit(result.status||1);
}
