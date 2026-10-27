(function(){
 'use strict';
 var controls=document.querySelector('.category-controls');
 if(!controls)return;
 var cards=document.querySelectorAll('.subject-card[data-area]');
 var status=document.getElementById('collection-status');
 var empty=document.getElementById('empty-collection');
 var emptyTitle=document.getElementById('empty-title');
 var buttons=controls.querySelectorAll('button[data-category]');
 function filter(category){
  if(['all','science','humanities'].indexOf(category)<0)return;
  var count=0;
  for(var i=0;i<cards.length;i++){var show=category==='all'||cards[i].getAttribute('data-area')===category;cards[i].hidden=!show;if(show)count++;}
  for(var j=0;j<buttons.length;j++)buttons[j].setAttribute('aria-pressed',String(buttons[j].getAttribute('data-category')===category));
  status.textContent='共 '+count+' 份资料';
  empty.hidden=count!==0;
  emptyTitle.textContent=category==='humanities'?'暂未上传文科资料':category==='science'?'暂未上传理科资料':'暂未上传学习资料';
 }
 controls.hidden=false;
 controls.addEventListener('click',function(event){var b=event.target.closest('button[data-category]');if(b&&controls.contains(b))filter(b.getAttribute('data-category'));});
 var shortcuts=document.querySelectorAll('a[data-filter-target]');
 for(var k=0;k<shortcuts.length;k++)shortcuts[k].addEventListener('click',function(){filter(this.getAttribute('data-filter-target'));});
}());
