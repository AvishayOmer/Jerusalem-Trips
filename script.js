

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
    }, 8000); // 8 שניות לכל תמונה
  }

  // טוען כל תמונה אחת־אחת
  let loaded = 0;
  wrapperList.forEach((wrapper, index) => {
    preloadImage(wrapper, () => {
      loaded++;
      if (loaded === wrapperList.length) {
        startGallery();
      }
    });

    // אפקט צבע בלחיצה
    const img = wrapper.querySelector('img');
    img.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
    });
  });

  // מניעת לחצן ימני
  document.addEventListener('contextmenu', e => e.preventDefault());
});


