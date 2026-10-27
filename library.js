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
 function filter(next){
  if(['all','science','humanities'].indexOf(next)>=0)category=next;
  var query=input.value.trim().toLowerCase();
  var words=query?query.split(/\s+/):[];
  var count=0;
  for(var i=0;i<cards.length;i++){
   var text=(cards[i].getAttribute('data-search')||'').toLowerCase();
   var show=(category==='all'||cards[i].getAttribute('data-area')===category)&&words.every(function(word){return text.indexOf(word)>=0;});
   cards[i].hidden=!show;if(show)count++;
  }
  for(var j=0;j<buttons.length;j++)buttons[j].setAttribute('aria-pressed',String(buttons[j].getAttribute('data-category')===category));
  status.textContent=query?'找到 '+count+' 份资料':'共 '+count+' 份资料';
  clear.disabled=input.value.length===0;
  empty.hidden=count!==0;
  emptyTitle.textContent=query?'没有找到相关资料':category==='humanities'?'暂未上传文科资料':category==='science'?'暂未上传理科资料':'暂未上传学习资料';
  emptyCopy.textContent=query?'试试更简短的关键词，或切换到全部资料。':'已有资料会在这里按学科展示。想看的内容，也欢迎进群告诉我。';
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
