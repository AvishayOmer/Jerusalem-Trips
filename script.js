

document.addEventListener('DOMContentLoaded', () => {
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  const validSlides = [];
  let current = 0;

  console.log("ברוך הבא לאתר טיולי ירושלים!");

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
    }, 8000);
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
    if (img) {
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });
    }
  });

  document.addEventListener('contextmenu', e => e.preventDefault());

  const toggleBtn = document.getElementById('modeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      document.body.classList.toggle('dark-mode'); // לשמירה על תאימות עם הקוד התחתון
      toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ מצב יום' : '🌙 מצב לילה';
    });
  }

  const scrollTopBtn = document.getElementById('backToTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const whatsappBtn = document.getElementById('whatsapp-chat');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/972505437050', '_blank');
    });
  } else {
    console.warn('אזהרה: כפתור וואטסאפ הצף לא נמצא בדף.');
  }

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

  const imageElement = document.getElementById('image-slider');
  if (imageElement) {
    const sliderImages = [
      'images/1.jpg',
      'images/2.jpg',
      'images/3.jpg',
      'images/4.jpg',
      'images/5.jpg',
      'images/6.jpg',
      'images/7.jpg',
      'images/8.jpg',
      'images/9.jpg',
      
    ];
    let currentImageIndex = 0;

    function changeImage() {
      currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
      imageElement.src = sliderImages[currentImageIndex];
    }

    setInterval(changeImage, 8000);
  }

  // הגלריה בסיבוב אוטומטי
  const galleryImages = document.querySelectorAll('.gallery img');
  let activeIndex = 0;

  function activateImage(index) {
    galleryImages.forEach(img => img.classList.remove('active'));
    galleryImages[index].classList.add('active');
  }

  if (galleryImages.length > 0) {
    setInterval(() => {
      activeIndex = (activeIndex + 1) % galleryImages.length;
      activateImage(activeIndex);
    }, 8000);
  }
});


