(function(){
 'use strict';
 var controls=document.querySelector('.category-controls');
 if(!controls)return;
 var cards=document.querySelectorAll('.subject-card[data-area]');
 var status=document.getElementById('collection-status');
 var empty=document.getElementById('empty-collection');
 var emptyTitle=document.getElementById('empty-title');
 var emptyCopy=document.getElementById('empty-description');
 var buttons=controls.querySelectorAll('button[data-category]');
 var search=document.querySelector('.library-search');
 var input=document.getElementById('library-query');
 var clear=document.getElementById('clear-search');
 var category='all';
 var subcategories=document.getElementById('course-subcategories');
 var titles={'all':'暂未上传学习资料','courses':'课程资料，整理中','science':'暂未上传理科资料','humanities':'暂未上传文科资料','course-guide':'选课指引，整理中','campus-life':'校园生活指南，整理中'};
 var descriptions={'course-guide':'这里将收录选课流程、课程介绍与选课经验。资料正在整理，后续会陆续上传。','campus-life':'这里将收录校园生存指南、办事流程与生活攻略。资料正在整理，后续会陆续上传。'};
 function filter(next){
  if(Object.prototype.hasOwnProperty.call(titles,next))category=next;
  var isCourse=['courses','science','humanities'].indexOf(category)>=0;
  subcategories.hidden=!isCourse;
  var query=input.value.trim().toLowerCase();
  var words=query?query.split(/\s+/):[];
  var count=0;
  for(var i=0;i<cards.length;i++){
   var text=(cards[i].getAttribute('data-search')||'').toLowerCase();
   var type=cards[i].getAttribute('data-type');
   var matchesCategory=category==='all'||category===type||(type==='courses'&&cards[i].getAttribute('data-area')===category);
   var show=matchesCategory&&words.every(function(word){return text.indexOf(word)>=0;});
   cards[i].hidden=!show;if(show)count++;
  }
  for(var j=0;j<buttons.length;j++){
   var key=buttons[j].getAttribute('data-category');
   buttons[j].setAttribute('aria-pressed',String(key===category||(key==='courses'&&isCourse)));
   if(key==='courses')buttons[j].setAttribute('aria-expanded',String(isCourse));
  }
  status.textContent=query?'找到 '+count+' 份资料':'共 '+count+' 份资料';
  clear.disabled=input.value.length===0;
  empty.hidden=count!==0;
  emptyTitle.textContent=query?'没有找到相关资料':titles[category];
  emptyCopy.textContent=query?'试试更简短的关键词，或切换到全部资料。':(descriptions[category]||'已有资料会在这里按学科展示。想看的内容，也欢迎进群告诉我。');
 }
 controls.hidden=false;search.hidden=false;
 controls.addEventListener('click',function(event){var b=event.target.closest('button[data-category]');if(b&&controls.contains(b))filter(b.getAttribute('data-category'));});
 input.addEventListener('input',function(){filter();});
 search.addEventListener('submit',function(event){event.preventDefault();filter();});
 clear.addEventListener('click',function(){input.value='';filter();input.focus();});
 var shortcuts=document.querySelectorAll('a[data-filter-target]');
 for(var k=0;k<shortcuts.length;k++)shortcuts[k].addEventListener('click',function(){filter(this.getAttribute('data-filter-target'));});
 filter();
}());
