import {defineConfig} from 'vitepress';
export default defineConfig({
 title:'学习资料库',titleTemplate:false,description:'课程学习、选课指引与校园生活资料',lang:'zh-CN',base:'/gcsx/',
 srcDir:'../.generated/pages',outDir:'../.output',cacheDir:'../.cache/vitepress',
 cleanUrls:false,lastUpdated:false,appearance:false,sitemap:{hostname:'https://tbb592.github.io/gcsx/'},
 head:[['meta',{name:'theme-color',content:'#4b315d'}],['link',{rel:'icon',type:'image/svg+xml',href:'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 rx=%2216%22 fill=%22%234b315d%22/%3E%3Ctext x=%2232%22 y=%2244%22 text-anchor=%22middle%22 fill=%22white%22 font-size=%2240%22%3E%E2%89%8B%3C/text%3E%3C/svg%3E'}]],
 vite:{ssr:{noExternal:['vitepress']}}
});
