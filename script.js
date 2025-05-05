

document.addEventListener('DOMContentLoaded', () => {
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  const validSlides = [];
  let current = 0;
// ניתן להרחיב בעתיד לאפקטים נוספים
console.log("ברוך הבא לאתר טיולי ירושלים!");


  // טעינת תמונות בגלריה
  function preloadImage(wrapper, callback) {
    const img = wrapper.querySelector('img');
    if (!img) {
      callback();
      return;
    }
    const tempImg = new Image();
    tempImg.src = img.src;

    tempImg.onload = () => {
      wrapper.classList.add('loaded');
      validSlides.push(wrapper);
      callback();
    };

    tempImg.onerror = () => {
      console.warn("בעיה בטעינת תמונה:", img.src);
      wrapper.remove();
      callback();
    };
  }

  function startGallery() {
    if (validSlides.length === 0) return;

    validSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === 0);
    });

    setInterval(() => {
      validSlides[current].classList.remove('active');
      current = (current + 1) % validSlides.length;
      validSlides[current].classList.add('active');
    }, 8000); // הזמן שבין החלפת תמונות
  }

  // טעינת תמונות
  let loaded = 0;
  wrapperList.forEach(wrapper => {
    preloadImage(wrapper, () => {
      loaded++;
      if (loaded === wrapperList.length) {
        startGallery();
      }
    });

    const img = wrapper.querySelector('img');
    if (img) {
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });
    }
  });

  // מניעת קליק ימני
  document.addEventListener('contextmenu', e => e.preventDefault());

  // מצב לילה / יום
  const toggleBtn = document.getElementById('modeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ מצב יום' : '🌙 מצב לילה';
    });
  }

  // כפתור חזרה למעלה
  const scrollTopBtn = document.getElementById('backToTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // כפתור וואטסאפ
  const whatsappBtn = document.getElementById('whatsapp-chat');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/972505437050', '_blank');
    });
  }

  // הפעלת / עצירת וידאו בלחיצה
  const videoElements = document.querySelectorAll('video');
  videoElements.forEach(video => {
    video.addEventListener('click', () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  });

  // החלפת תמונה בגלריה אם יש אלמנט כזה
  const imageElement = document.getElementById('image-slider');
  if (imageElement) {
    const images = [
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/4.jpg',
      'images/5.jpg',
      'images/6.jpg',
      'images/7.jpg',
      'images/8.jpg',
      'images/9.jpg',
      'images/10.jpg',


    ];
    let currentImageIndex = 0;

    function changeImage() {
      currentImageIndex = (currentImageIndex + 1) % images.length;
      imageElement.src = images[currentImageIndex];
    }

    setInterval(changeImage, 8000);
  }

  // הגלריה בסיבוב אוטומטי
  const images = document.querySelectorAll('.gallery img');
  let activeIndex = 0;

  function activateImage(index) {
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
  }

  setInterval(() => {
    activeIndex = (activeIndex + 1) % images.length;
    activateImage(activeIndex);
  }, 8000); // כל 8 שניות
});
// script.js

// מצב כהה ובהיר
const toggleBtn = document.getElementById('modeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

// כפתור חזור למעלה
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
});

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// כפתור וואטסאפ
const whatsappChat = document.getElementById('whatsapp-chat');
if (whatsappChat) {
  whatsappChat.addEventListener('click', () => {
    window.open('https://wa.me/972505437050', '_blank');
  });
} else {
  console.warn('אזהרה: כפתור וואטסאפ הצף לא נמצא בדף.');
} 

