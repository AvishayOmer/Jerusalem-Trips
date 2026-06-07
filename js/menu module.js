function initMenu(){

const hamburger=
 document.querySelector('.hamburger');

const mobileMenu=
 document.querySelector('.mobile-menu');

if(!hamburger || !mobileMenu)
return;

hamburger.addEventListener(
'click',
()=>{
mobileMenu.classList.toggle('active');
});

}