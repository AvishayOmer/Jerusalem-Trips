

function showToast(
message,
type="success"
){

let toast=
document.getElementById(
"toast"
);

if(!toast){

toast=
document.createElement(
"div"
);

toast.id="toast";

toast.className="toast";

document.body.appendChild(
toast
);

}

toast.innerText=message;

toast.style.background=

type==="success"

?

"rgba(34,197,94,.92)"

:

"rgba(239,68,68,.92)";

toast.classList.add(
"show"
);

setTimeout(()=>{

toast.classList.remove(
"show"
);

},2500);

}

if(openBtn){

openBtn.onclick=()=>{

modal.style.display=
"block";

};

}

if(closeBtn){

closeBtn.onclick=()=>{

modal.style.display=
"none";

};

}

window.onclick=(e)=>{

if(
e.target===modal
){

modal.style.display=
"none";
}

};


/* ==========================
   CONTACT FORM
========================== */

let isSending=false;

if(form){

form.addEventListener(
"submit",
function(e){

e.preventDefault();

if(isSending)
return;

isSending=true;

const btn=
form.querySelector(
"button[type='submit']"
);

btn.disabled=true;

btn.innerText=
"שולח...";


const firstName=
document.getElementById(
"firstName"
)?.value || "";

const lastName=
document.getElementById(
"lastName"
)?.value || "";

const phone=
document.getElementById(
"phone"
)?.value || "";

const email=
document.getElementById(
"email"
)?.value || "";


emailjs.send(

"tripjeru_service",

"template_4qoa25e",

{

first_name:firstName,
last_name:lastName,
phone:phone,
user_email:email

}

)

.then(()=>{

showToast(
"נשלח בהצלחה ✅"
);

form.reset();

modal.style.display=
"none";


const whatsappMessage=`

📩 פנייה חדשה

👤 ${firstName} ${lastName}

📞 ${phone}

📧 ${email}

`;

window.open(

`https://wa.me/972503251251?text=${encodeURIComponent(whatsappMessage)}`,

"_blank"

);

})

.catch((err)=>{

console.log(err);

showToast(

"שגיאה בשליחה ❌",

"error"

);

})

.finally(()=>{

isSending=false;

btn.disabled=false;

btn.innerText=
"שליחה";

});

});

}

