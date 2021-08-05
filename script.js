'use strict';

//selected
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');


const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const nav = document.querySelector('.nav');

//tabbed component

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');


///////////////////////////////////////;


// Modal window


const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


btnScrollTo.addEventListener('click', function (e) {
  section1.scrollIntoView({ behavior: 'smooth' });
});

//page Navigation

//this one is commented out as this was not effient 
//using Event bubbling we can create the same on the parent element and in that we could check if e.target 
//is what we want our event to work on



// document.querySelectorAll('.nav__link').forEach(function (el) {
// 
// el.addEventListener('click', function (e) {
// e.preventDefault();
// const id = this.getAttribute('href')
// console.log(id);
// document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// })
// });


//Using event bubbling
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  console.log(e.target);
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href')
    console.log(e.target);
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});



//using event deligation (event bubbling just like above )
tabsContainer.addEventListener('click', function (e) {
  // console.log('UPlink');
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //gaurd clause
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //activating tab
  clicked.classList.add('operations__tab--active');

  //
  // console.log(clicked.dataset.tab);
  //changing the tab data
  // const dataTab = e.target.getAttribute('data-tab');
  // console.log(dataTab);
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
});


//menu fade animation
const handleover = function (e, opacityVar) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(function (el) {
      if (el !== link) {
        el.style.opacity = opacityVar;
      }
    });
    logo.style.opacity = opacityVar;
  }

};



nav.addEventListener('mouseover', function (e) {
  handleover(e, 0.5);
});

nav.addEventListener('mouseout', function (e) {
  handleover(e, 1);
});


//stickey navigations
//Intersection observer API ( for scroling)
const header = document.querySelector('.header');
//dyanamic way to calculate the height from the header
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`
});

headerObserver.observe(header);


//reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading images using Intersection  observer API
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImage = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  //replace the source attribute with data-src
  entry.target.src = entry.target.dataset.src;
  //once the image is laoded then only remove the blur part
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  //as the image is laoded we no longer needed to observe them
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImage, {
  root: null,
  threshold: 0,
  rootMargin: '+200px',
});

imgTargets.forEach(img => imgObserver.observe(img));




//slider

const slides = document.querySelectorAll('.slide');

const slider = document.querySelector('.slider');
const btnleft = document.querySelector('.slider__btn--left');
const btnright = document.querySelector('.slider__btn--right');

const dotContainer = document.querySelector('.dots');


let curSlide = 0
const maxSlide = slides.length - 1;
// slider.style.transform = 'scale(0.2)';
// slider.style.overflow = 'visible';

//dot to change the slides'
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`);
  });
};
const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach(function (s) {
    s.classList.remove('dots__dot--active');
  });
  document.querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add('dots__dot--active');
}





function slideToGo(slide) {
  slides.forEach((s, i) => (s.style.transform = `translateX(${(i - slide) * 100}%)`));
}

const nextSlide = function () {
  if (curSlide === maxSlide) {
    curSlide = 0;
  } else {
    curSlide++;
  }

  slideToGo(curSlide);
  activateDot(curSlide);
};

const preSlide = function () {
  if (curSlide != 0) {
    curSlide--;
  }
  else {
    curSlide = maxSlide
  }
  slideToGo(curSlide)
  activateDot(curSlide);
};

btnright.addEventListener('click', nextSlide);

btnleft.addEventListener('click', preSlide);




const init = function () {
  slideToGo(0); //to be on the first slide
  createDots();
  activateDot(0)

};
init();

//keybord arrow using to move slider
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  if (e.key === 'ArrowLeft') {
    preSlide();
  }
});


// changing slides using dots in bottom(using event delgation)
dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    slideToGo(slide);
    activateDot(slide);

  }
});


// 
/*
we can also use bind but could only use one variable to pass
nav.addEventListener('mouseover'), handleHover.bind(0.5));

--> in the calling functio this would be equal to 0.5 and we don't have to specify e
*/

//random color function

// const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)


// document.querySelector('.nav__link').addEventListener('click', function (e) {
  // console.log('link');
  // this.style.
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
  // console.log('link');
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
  // console.log('link');
// });