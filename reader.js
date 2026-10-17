(function(){
 'use strict';
 var form=document.querySelector('.page-jump');
 var stack=document.getElementById('page-stack');
 if(!form||!stack)return;
 var input=form.querySelector('input[name="page"]');
 var error=document.getElementById('page-error');
 var total=Number(form.getAttribute('data-total-pages'));
 var jumpedPage=null;
 function align(number){
  var target=document.getElementById('pdf-page-'+number);
  if(!target)return;
  // Reserve enough space for a short final page to align at the viewport top.
  stack.style.paddingBottom=(number===total?Math.max(14,stack.clientHeight-target.offsetHeight):14)+'px';
  var top=target.getBoundingClientRect().top-stack.getBoundingClientRect().top+stack.scrollTop-stack.clientTop;
  stack.scrollTo({top:Math.max(0,top),left:stack.scrollLeft,behavior:'auto'});
 }
 form.hidden=false;
 form.addEventListener('submit',function(event){
  event.preventDefault();
  var value=input.value.trim();
  var number=Number(value);
  if(!/^\d+$/.test(value)||number<1||number>total||Math.floor(number)!==number){
   input.setAttribute('aria-invalid','true');
   error.textContent='请输入 1～'+total+' 之间的整数页码。';
   error.hidden=false;
   input.focus();
   return;
  }
  input.setAttribute('aria-invalid','false');
  error.hidden=true;
  error.textContent='';
  input.value=String(number);
  jumpedPage=number;
  align(number);
  try{history.replaceState(null,'','#pdf-page-'+number);}catch(ignore){}
 });
 var zoom=document.getElementById('reader-zoom');
 if(zoom)zoom.addEventListener('change',function(){if(jumpedPage!==null)align(jumpedPage);});
 // Once the reader manually scrolls, avoid snapping back to an earlier jump.
 function manualNavigation(){jumpedPage=null;}
 stack.addEventListener('wheel',manualNavigation,{passive:true});
 stack.addEventListener('touchstart',manualNavigation,{passive:true});
 stack.addEventListener('pointerdown',manualNavigation);
 stack.addEventListener('keydown',manualNavigation);
}());
