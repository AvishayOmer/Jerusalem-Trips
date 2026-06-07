function initBackToTop(){

const btn=
 document.getElementById('backToTop');

if(!btn)
return;

window.addEventListener(
'scroll',
()=>{

if(window.scrollY>300){
 btn.style.display='flex';
}
else{
 btn.style.display='none';
}

});

btn.addEventListener(
'click',
()=>{

window.scrollTo({
 top:0,
 behavior:'smooth'
});

});

}