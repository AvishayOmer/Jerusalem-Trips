

document.addEventListener('DOMContentLoaded', () => {
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  const validSlides = [];
  let current = 0;

  function preloadImage(wrapper, callback) {
    const img = wrapper.querySelector('img');
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
      if (i !== 0) slide.classList.remove('active');
      else slide.classList.add('active');
    });

    setInterval(() => {
      validSlides[current].classList.remove('active');
      current = (current + 1) % validSlides.length;
      validSlides[current].classList.add('active');
    }, 8000); // תמונות יתעדכנו כל 8 שניות
  }

  let loaded = 0;
  wrapperList.forEach(wrapper => {
    preloadImage(wrapper, () => {
      loaded++;
      if (loaded === wrapperList.length) {
        startGallery();
      }
    });

    const img = wrapper.querySelector('img');
    img.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
    });
  });

  // מניעת קליק ימני
  document.addEventListener('contextmenu', e => e.preventDefault());

  // מצב לילה
  const toggleBtn = document.getElementById('toggle-dark');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ מצב יום' : '🌙 מצב לילה';
  });

  // כפתור גלילה למעלה
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // כפתור וואטסאפ
  document.getElementById('whatsapp-chat').addEventListener('click', () => {
    window.open('https://wa.me/972505437050', '_blank');
  });
});
// JavaScript - שיפור החלפת התמונות
let currentImageIndex = 0;
const images = [
  'images/1.jpg',
  'images/2.jpg',
  'images/3.jpg',
  'images/4.jpg',
  'images/5.jpg',
  'images/6.jpg'
];

function changeImage() {
  currentImageIndex = (currentImageIndex + 1) % images.length;
  const imageElement = document.getElementById('image-slider');
  imageElement.src = images[currentImageIndex];
}

// החלפת תמונות כל 8 שניות
setInterval(changeImage, 8000);

// JavaScript - תיקון הווידיאו
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

// מענה על מצב לילה
const toggleDarkButton = document.getElementById('toggle-dark');
toggleDarkButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});


