
function initModal(){

const modal=
 document.getElementById('contactModal');

const openBtn=
 document.getElementById('openContactModal');

const closeBtn=
 document.querySelector('.close');

if(!modal || !openBtn || !closeBtn)
return;

openBtn.onclick=function(){
 modal.style.display='flex';
}

closeBtn.onclick=function(){
 modal.style.display='none';
}

window.onclick=function(e){

if(e.target===modal){
 modal.style.display='none';
}

}

}