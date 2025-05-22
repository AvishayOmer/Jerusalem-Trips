

document.addEventListener('DOMContentLoaded', () => {
  console.log("ברוך הבא לאתר טיולי ירושלים!");

  // משתנים גלובליים
  const images = [
    "images/1.jpg",
    "images/2.jpg",
    "images/3.jpg",
    "images/4.jpg",
    "images/5.jpg",
  ];

  // גלריית תמונות
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  let validSlides = [];
  let current = 0;

  // preload תמונות והפעלת גלריה
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
      console.warn("בעיה בתמונה:", img.src);
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
      // שינוי אפקט אפור/צבע בלחיצה
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });
      // אפקטי hover לגלריה
      img.addEventListener('mouseenter', () => {
        img.style.transition = 'transform 0.5s ease, filter 0.5s ease';
        img.style.transform = 'scale(1.05)';
        img.style.filter = 'grayscale(0%)';
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.filter = 'grayscale(100%)';
      });
    }
  });

  // חסימת כפתור ימני על תמונות בגלריה + התראה
  const galleryImages = document.querySelectorAll('.gallery img');
  galleryImages.forEach(image => {
    image.addEventListener('contextmenu', e => {
      e.preventDefault();
      alert("העתקה של תמונות אסורה!");
    });
  });

  // חסימת העתקה (CTRL + C) של התוכן
  document.body.addEventListener('copy', e => {
    e.preventDefault();
    alert("העתקה של תוכן אסורה!");
  });

  // אנימציה ללוגו
  const logo = document.getElementById('sitestyle-logo');
  if (logo) {
    setInterval(() => {
      logo.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        logo.style.transform = 'translateY(5px)';
      }, 500);
    }, 2000);
  }

  // מצב לילה / יום ושמירת בחירה ב-localStorage
  const modeToggle = document.getElementById('modeToggle');
  function setMode(dark) {
    if (dark) {
      document.body.classList.add('dark-mode');
      modeToggle.textContent = '☀️ מצב יום';
    } else {
      document.body.classList.remove('dark-mode');
      modeToggle.textContent = '🌙 מצב לילה';
    }
    localStorage.setItem('darkMode', dark);
  }
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-mode');
      setMode(!isDark);
    });
  }
  window.addEventListener('load', () => {
    const darkModeStored = localStorage.getItem('darkMode');
    setMode(darkModeStored === 'true');
  });

  // כפתור חזרה למעלה
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.style.display = 'flex';
      } else {
        backToTop.style.display = 'none';
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // כפתור וואטסאפ
  const whatsappBtn = document.getElementById('whatsapp-chat');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/972505437050', '_blank');
    });
  } else {
    console.warn('כפתור וואטסאפ לא נמצא בדף.');
  }

  // סלאיידר תמונות עם אפקט אפור לצבע
  let currentIndex = 0;
  const imageSlider = document.getElementById('image-slider');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  function changeImage(index) {
    if (!imageSlider) return;
    imageSlider.classList.remove('colorful');
    imageSlider.style.opacity = 0;
    setTimeout(() => {
      currentIndex = index;
      imageSlider.src = images[currentIndex];
      imageSlider.style.opacity = 1;
      setTimeout(() => {
        imageSlider.classList.add('colorful');
      }, 500);
    }, 500);
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = images.length - 1;
      changeImage(newIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      let newIndex = (currentIndex + 1) % images.length;
      changeImage(newIndex);
    });
  }

  setInterval(() => {
    let newIndex = (currentIndex + 1) % images.length;
    changeImage(newIndex);
  }, 8000);

  // אנימציה קלה לתמונות בגלריה
  galleryImages.forEach(img => {
    img.classList.add('gallery-image-animate');
    img.style.transition = 'transform 0.3s ease';
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'translateY(-3px)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'translateY(0)';
    });
  });

  // אנימציות גלילה - IntersectionObserver
  const animatedSections = document.querySelectorAll('.section-animate');
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0 });

  animatedSections.forEach(section => observer.observe(section));

});

  // גלריית תמונות - איתור כל ה-wrappers תקינים
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  const validSlides = [];
  let current = 0;

  // רשימת תמונות (לשימוש נוסף אם צריך)
  const images = [
    'images/1.jpg',
    'images/3.jpg',
    'images/4.jpg',
    'images/5.jpg',
    'images/7.jpg',
    'images/8.jpg',
    'images/9.jpg'
  ];

  // פונקציה לטעינת תמונה מראש
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

  // הפעלת הגלריה - מעבר בין התמונות כל 8 שניות
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

  // טעינת כל התמונות בגלריה
  let loaded = 0;
  wrapperList.forEach(wrapper => {
    preloadImage(wrapper, () => {
      loaded++;
      if (loaded === wrapperList.length) {
        startGallery();
      }
    });

    // אפקטי מעבר על תמונות בגלריה
    const img = wrapper.querySelector('img');
    if (img) {
      img.style.transition = 'transform 0.3s ease-out, filter 0.3s ease-out';
      img.style.filter = 'grayscale(100%)';

      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        img.style.filter = 'grayscale(0%)';
      });
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.filter = 'grayscale(100%)';
      });

      // לחיצה על תמונה - הפעלה או ביטול אפקט אפור
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });
    }
  });

  // אנימציה לכותרות (h2)
  const headings = document.querySelectorAll('h2');
  headings.forEach(h => {
    h.style.animation = 'fadeInUp 2s ease-out';
  });

  // אנימציה לפסקאות
  const paragraphs = document.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.style.transition = 'color 0.4s, transform 0.4s';
    p.addEventListener('mouseenter', () => {
      p.style.color = '#ff6600';
      p.style.transform = 'scale(1.05)';
    });
    p.addEventListener('mouseleave', () => {
      p.style.color = '';
      p.style.transform = 'scale(1)';
    });
  });

  // חסימת לחיצה ימנית על כל תמונות הגלריה עם הודעה
  document.querySelectorAll('.gallery img').forEach(image => {
    image.addEventListener('contextmenu', e => {
      e.preventDefault();
      alert("העתקה של תמונות אסורה!");
    });

    // חסימת גרירה של תמונות
    image.addEventListener('dragstart', e => e.preventDefault());
  });

  // חסימת העתקת תוכן עם Ctrl+C
  document.body.addEventListener('copy', e => {
    e.preventDefault();
    alert("העתקה של תוכן אסורה!");
  });

  // אנימציית לוגו מתנדנד
  const logo = document.getElementById('site-logo');
  if (logo) {
    logo.style.transition = 'transform 1s ease-in-out';
    setInterval(() => {
      logo.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        logo.style.transform = 'translateY(5px)';
      }, 500);
    }, 2000);
  }

  
// JavaScript להפעלה של כפתור חזרה למעלה
document.getElementById('backToTop').addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
document.addEventListener('DOMContentLoaded', () => {
  const centerElements = document.querySelectorAll('section, header');
  centerElements.forEach(el => {
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.textAlign = 'center';
    el.style.padding = '20px';
    el.style.animation = 'floatUpDown 3s ease-in-out infinite';
  });

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }

    body.dark-mode {
      background-color: #121212;
      color: #ffffff;
    }

    body.dark-mode header, body.dark-mode section {
      background-color: #1e1e1e;
      border-radius: 10px;
    }

    .dark-mode a { color: #90caf9; }
  `;
  document.head.appendChild(style);

  const imageElement = document.getElementById('image-slider');
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
    'images/10.jpg',
  ];

  let currentImageIndex = 0;
  setInterval(() => {
    currentImageIndex = (currentImageIndex + 1) % sliderImages.length;
    imageElement.src = sliderImages[currentImageIndex];
    imageElement.classList.add('image-fade-in');
    setTimeout(() => {
      imageElement.classList.remove('image-fade-in');
    }, 1000);
  }, 8000);

  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      modeToggle.textContent = isDark ? '☀️ מצב יום' : '🌙 מצב לילה';
      localStorage.setItem('darkMode', isDark);
    });

    const darkModePref = localStorage.getItem('darkMode') === 'true';
    if (darkModePref) {
      document.body.classList.add('dark-mode');
      modeToggle.textContent = '☀️ מצב יום';
    }
  }

  const whatsappBtn = document.getElementById('whatsapp-chat');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/972505437050', '_blank');
    });
  }

  const logo = document.getElementById('site-logo');
  if (logo) {
    logo.style.transition = 'transform 1s ease-in-out';
    setInterval(() => {
      logo.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        logo.style.transform = 'translateY(5px)';
      }, 500);
    }, 2000);
  }

  const galleryImages = document.querySelectorAll('.gallery img');
  galleryImages.forEach(img => {
    img.style.transition = 'transform 0.3s ease';
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'translateY(-3px)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'translateY(0)';
    });
  });

  document.querySelectorAll('.gallery img').forEach(image => {
    image.addEventListener('contextmenu', e => {
      e.preventDefault();
      alert("העתקה של תמונות אסורה!");
    });
    image.addEventListener('dragstart', e => e.preventDefault());
  });

  document.body.addEventListener('copy', e => {
    e.preventDefault();
    alert("העתקה של תוכן אסורה!");
  });

  // אפקטים נוספים לטקסט וכפתורים
  const headings = document.querySelectorAll('h2');
  headings.forEach(h => {
    h.style.animation = 'fadeInUp 2s ease-out';
  });

  const paragraphs = document.querySelectorAll('p');
  paragraphs.forEach(p => {
    p.style.transition = 'color 0.4s, transform 0.4s';
    p.addEventListener('mouseenter', () => {
      p.style.color = '#ff6600';
      p.style.transform = 'scale(1.05)';
    });
    p.addEventListener('mouseleave', () => {
      p.style.color = '';
      p.style.transform = 'scale(1)';
    });
  });
});
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

    const img = wrapper.querySelector('img');
    if (img) {
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });

      // הוספת אנימציה לאנימציות של הגלריה
      img.addEventListener('mouseenter', () => {
        img.style.transition = 'transform 0.3s ease-out, filter 0.3s ease-out';
        img.style.transform = 'scale(1.1)';
        img.style.filter = 'grayscale(0%)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transition = 'transform 0.3s ease-out, filter 0.3s ease-out';
        img.style.transform = 'scale(1)';
        img.style.filter = 'grayscale(100%)';
      });
    }
  });

  // מניעת קליקים עם כפתור ימני
  document.addEventListener('contextmenu', e => e.preventDefault());

  // מצב לילה ויום
  const toggleBtn = document.getElementById('modeToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      document.body.classList.toggle('dark-mode');
      toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ מצב יום' : '🌙 מצב לילה';
      toggleBtn.classList.toggle('button-toggle-animate');
    });
  }

  // כפתור חזרה למעלה
  const scrollTopBtn = document.getElementById('backToTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
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

  
  } else {
    console.warn('אזהרה: כפתור וואטסאפ הצף לא נמצא בדף.');
  }
document.addEventListener('DOMContentLoaded', () => {
  console.log("ברוך הבא לאתר טיולי ירושלים!");

  // ===================== קבועים =====================
  const galleryImages = document.querySelectorAll('.gallery img');
  const wrapperList = Array.from(document.querySelectorAll('.gallery .image-wrapper'));
  const validSlides = [];
  let current = 0;

  const images = [
    'images/1.jpg', 'images/2.jpg', 'images/3.jpg',
    'images/4.jpg', 'images/5.jpg', 'images/6.jpg',
    'images/7.jpg', 'images/8.jpg', 'images/9.jpg'
  ];

  // ===================== לוגו מתנדנד =====================
  const logo = document.getElementById('site-logo');
  if (logo) {
    logo.style.transition = 'transform 1s ease-in-out';
    setInterval(() => {
      logo.style.transform = 'translateY(-5px)';
      setTimeout(() => {
        logo.style.transform = 'translateY(5px)';
      }, 500);
    }, 2000);
  }

  // ===================== טעינת גלריה =====================
  function preloadImage(wrapper, callback) {
    const img = wrapper.querySelector('img');
    if (!img) return callback();
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
    if (!validSlides.length) return;
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
      if (loaded === wrapperList.length) startGallery();
    });

    const img = wrapper.querySelector('img');
    if (img) {
      img.addEventListener('click', e => {
        e.preventDefault();
        img.style.filter = img.style.filter === 'grayscale(0%)' ? 'grayscale(100%)' : 'grayscale(0%)';
      });

      img.addEventListener('mouseenter', () => {
        img.style.transition = 'transform 0.5s ease-out, filter 0.5s ease-out';
        img.style.transform = 'scale(1.05)';
        img.style.filter = 'grayscale(0%)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.filter = 'grayscale(100%)';
      });
    }
  });

  // ===================== תמונה מתחלפת =====================
  const imageSlider = document.getElementById("image-slider");
  let currentIndex = 0;
  if (imageSlider) {
    setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      imageSlider.src = images[currentIndex];
      imageSlider.classList.add('image-fade-in');
      setTimeout(() => imageSlider.classList.remove('image-fade-in'), 1000);
    }, 8000);
  }

  // ===================== מצב לילה =====================
  const modeToggle = document.getElementById("modeToggle");
  function setMode(dark) {
    document.body.classList.toggle('dark-mode', dark);
    if (modeToggle) modeToggle.textContent = dark ? '☀️ מצב יום' : '🌙 מצב לילה';
    localStorage.setItem("darkMode", dark);
  }
  if (modeToggle) {
    modeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-mode");
      setMode(!isDark);
    });
  }
  const darkModeStored = localStorage.getItem("darkMode") === 'true';
  setMode(darkModeStored);

  // ===================== כפתור חזרה למעלה =====================
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("show", window.scrollY > 300);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ===================== כפתור וואטסאפ =====================
  const whatsappChat = document.getElementById("whatsapp-chat");
  if (whatsappChat) {
    whatsappChat.addEventListener("click", () => {
      window.open("https://wa.me/972505437050", "_blank");
    });
  }

  // ===================== מניעת העתקה =====================
  galleryImages.forEach(img => {
    img.addEventListener('contextmenu', e => {
      e.preventDefault();
      alert("העתקה של תמונות אסורה!");
    });
    img.addEventListener('dragstart', e => e.preventDefault());
  });

  document.body.addEventListener('copy', e => {
    e.preventDefault();
    alert("העתקה של תוכן אסורה!");
  });

  // ===================== אנימציית לוגו =====================
  const logoContainer = document.getElementById("logo-container");
  if (logoContainer) {
    logoContainer.addEventListener("mouseenter", () => {
      logoContainer.style.animationPlayState = "paused";
    });
    logoContainer.addEventListener("mouseleave", () => {
      logoContainer.style.animationPlayState = "running";
    });
  }

  // ===================== הפעלת וידאו בלחיצה =====================
  const videoElements = document.querySelectorAll("video");
  videoElements.forEach(video => {
    video.addEventListener("click", () => {
      if (video.paused) video.play();
      else video.pause();
    });
  });

  // ===================== גלילה - אנימציה =====================
  const animatedSections = document.querySelectorAll(".section-animate");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  animatedSections.forEach(section => observer.observe(section));

  // ===================== סידור תוכן במרכז =====================
  const centerElements = document.querySelectorAll('section, header');
  centerElements.forEach(el => {
    el.style.display = 'flex';
    el.style.flexDirection = 'column';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.textAlign = 'center';
    el.style.padding = '20px';
    el.style.animation = 'floatUpDown 3s ease-in-out infinite';
  });

  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes floatUpDown {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    body.dark-mode {
      background-color: #121212;
      color: #ffffff;
    }
    body.dark-mode header, body.dark-mode section {
      background-color: #1e1e1e;
      border-radius: 10px;
    }
    .dark-mode a { color: #90caf9; }
  `;
  document.head.appendChild(style);

});
{
}

// ===================== מניעת העתקה =====================
galleryImages.forEach(img => {
  img.addEventListener('contextmenu', e => {
    e.preventDefault();
    alert("העתקה של תמונות אסורה!");
  });
  img.addEventListener('dragstart', e => e.preventDefault());
});
document.addEventListener('contextmenu', e => e.preventDefault());
// מניעת לחצן ימני על כל התמונות בגלריה
document.querySelectorAll('.gallery img').forEach(img => {
  img.addEventListener('contextmenu', e => e.preventDefault());
});


