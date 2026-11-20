<script setup>
import {onMounted,nextTick,watch} from 'vue';
import {useData,useRoute,withBase,Content} from 'vitepress';
const {frontmatter}=useData();
const route=useRoute();
async function initialise(){
 await nextTick();
 document.querySelectorAll('script[data-study-runtime]').forEach(script=>script.remove());
 for(const name of (frontmatter.value.reader?['reader.js','feedback.js']:frontmatter.value.home?['library.js']:['feedback.js'])){
  const script=document.createElement('script');script.dataset.studyRuntime='true';script.src=withBase('/'+name+'?v=20261120');script.async=false;document.body.appendChild(script);
 }
}
onMounted(initialise);
watch(()=>route.path,initialise,{flush:'post'});
</script>
<template>
 <div id="study-layout">
  <div v-if="frontmatter.legacyHtml" v-html="frontmatter.legacyHtml"></div>
  <template v-else-if="frontmatter.before">
   <div v-html="frontmatter.before"></div>
   <main id="main" class="wrap prose-article"><Content /></main>
   <div v-html="frontmatter.after"></div>
  </template>
  <main v-else class="wrap prose-article"><h1>页面未找到</h1><p>资料可能已调整，请返回首页查找。</p><a :href="withBase('/')">返回学习资料库</a></main>
 </div>
</template>
