(function(){
 'use strict';
 var choices=document.querySelector('.feedback-options');
 if(!choices)return;
 var status=document.getElementById('feedback-status');
 var group=document.getElementById('feedback-group');
 var buttons=choices.querySelectorAll('button');
 choices.addEventListener('click',function(event){
  var button=event.target.closest('button[data-feedback]');
  if(!button||!choices.contains(button))return;
  for(var i=0;i<buttons.length;i++)buttons[i].setAttribute('aria-pressed',String(buttons[i]===button));
  var kind=button.getAttribute('data-feedback');
  if(kind==='helpful'){
   group.hidden=true;
   status.textContent='谢谢你的支持！希望这份笔记能继续帮到你。';
  }else{
   group.hidden=false;
   status.textContent=kind==='supplement'?'想补充哪些内容？欢迎进群告诉我，一起完善笔记。':'谢谢你帮忙纠错！欢迎进群说明页码和问题，方便我核对。';
  }
 });
}());
