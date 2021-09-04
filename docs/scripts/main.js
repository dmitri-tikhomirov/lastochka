/*******************************************************************************
* Focus *
*******************************************************************************/

function tabHandler(event) {
  if (event.key === 'Tab') { // Tab
    document.body.classList.add('user-is-tabbing');
    window.removeEventListener('keydown', tabHandler);
    window.addEventListener('mousedown', mouseDownHandler);
  }
}

function mouseDownHandler() {
  document.body.classList.remove('user-is-tabbing');
  window.removeEventListener('mousedown', mouseDownHandler);
  window.addEventListener('keydown', tabHandler);
}

window.addEventListener('keydown', tabHandler);

/*******************************************************************************
* Navigation *
*******************************************************************************/

const navMoreAndDropdown = document.querySelector('.nav-more-and-dropdown');
const navDropdown = document.querySelector('.nav-dropdown');
const navMore = document.querySelector('.nav-more');
const navMoreIcon = document.querySelector('.nav-more-icon');
const navMobileIcon = document.querySelector('.nav-mobile-icon');
const navCloseIcon = document.querySelector('.nav-close-icon');
let dropdownOpened = false;
let dropdownJustOpenedByMouseEnter = false;

navMoreAndDropdown.addEventListener('mouseenter', (event) => {
  navMoreAndDropdown.classList.add('nav-dropdown-open');
  dropdownOpened = true;

  dropdownJustOpenedByMouseEnter = true;
  setTimeout(() => {
    dropdownJustOpenedByMouseEnter = false;
  }, 100);
});

navMoreAndDropdown.addEventListener('mouseleave', (event) => {
  if (dropdownOpened) {
    navMoreAndDropdown.classList.remove('nav-dropdown-open');
    dropdownOpened = false;
  }
});

document.addEventListener('click', (event) => {
  if (dropdownJustOpenedByMouseEnter) {
    return;
  }

  // Open dropdown on tap
  if (!dropdownOpened && navMoreAndDropdown.contains(event.target)) {
    navMoreAndDropdown.classList.add('nav-dropdown-open');
    dropdownOpened = true;
    return;
  }

  // Close dropdown on outside tap
  if (dropdownOpened) {
    if (!navDropdown.contains(event.target)) {
      navMoreAndDropdown.classList.remove('nav-dropdown-open');
      dropdownOpened = false;
      return;
    } else {
      const navDropdownLinks = navDropdown.querySelectorAll('a[href], button');

      // Close dropdown on tapping or clicking an inside link
      navDropdownLinks.forEach((element) => {
        if (element.contains(event.target)) {
          navMoreAndDropdown.classList.remove('nav-dropdown-open');
          dropdownOpened = false;
          return;
        }
      });
    }
  }
});

/*******************************************************************************
* Priority navigation *
*******************************************************************************/

// Remove CSS fallback used if no JavaScript is available
document.querySelector('.nav').classList.remove('nav-no-javascript');

const navItems = document.querySelectorAll('.nav-item');
const navDropdownItems = document.querySelectorAll('.nav-item-dropdown');

let navWidth = document.querySelector('.nav').getBoundingClientRect().width;

const navAdapt = () => {
  // Reveal all items before calculation
  navItems.forEach((item) => {
    item.classList.remove('hide');
  });

  navDropdownItems.forEach((item) => {
    item.classList.remove('hide');
  });

  navMoreAndDropdown.style.display = 'block';

  const navMoreWidth = navMoreAndDropdown.getBoundingClientRect().width +
    parseFloat(window.getComputedStyle(navMoreAndDropdown)
      .getPropertyValue('margin-left'));
  const navHiddenItems = [];
  let stopWidth = navMoreWidth;
  let stopReached = false;

  // Hide nav items that don't fit
  navItems.forEach((item, index, array) => {
    if (stopReached === false) {
      const itemMargin = parseFloat(window.getComputedStyle(item)
        .getPropertyValue('margin-left'));

      // Try to fit the last item without "more"
      if (index === array.length - 1) {
        stopWidth -= navMoreWidth;
      }

      if (navWidth >= stopWidth + item.getBoundingClientRect().width +
          itemMargin) {
        stopWidth = stopWidth + item.getBoundingClientRect().width + itemMargin;
      } else {
        stopReached = true;
      }
    }

    if (stopReached === true) {
      item.classList.add('hide');
      navHiddenItems.push(index);
    }
  });

  // Hide "more" and dropdown items
  if (!navHiddenItems.length) {
    navMoreAndDropdown.style.display = '';
  } else {
    navDropdownItems.forEach((item, index) => {
      if(!navHiddenItems.includes(index)) {
        item.classList.add('hide');
      }
    });
  }
}

// Adapt immediately
navAdapt();

// Adapt on window resize
window.addEventListener('resize', () => {
  const newWidth =
    document.querySelector('.nav').getBoundingClientRect().width;

  if (navWidth !== newWidth) {
    navWidth = newWidth;
    navAdapt();
  }
});

/*******************************************************************************
* Sticky shrinking header *
*******************************************************************************/

const header = document.querySelector('.header');
const headerWrapper = document.querySelector('.header-wrapper');
const headerWrapperWrapper = document.querySelector('.header-wrapper-wrapper');
const headerPlaceholder = document.querySelector('.header-placeholder');
let headerIsSticky = false;
let headerStickyHeight = 60;

const headerObserver = new IntersectionObserver(sticky, {
  threshold: 0.95 // 1 might not always work due to fractional pixels handling
});

headerObserver.observe(headerWrapperWrapper);

function sticky(entries, observer) {
  entries.forEach((entry) => {
    if (entry.target === headerWrapperWrapper &&
        entry.intersectionRatio < 0.95) {
      headerWrapper.classList.remove('header-hide');
      header.classList.remove('header-slide-in');

      headerPlaceholder.style.height =
        header.getBoundingClientRect().height + 'px';
      headerWrapperWrapper.classList.add('header-sticky');
      headerWrapperWrapper.classList.add('header-hide');
      headerWrapper.classList.add('header-slide-in');

      headerIsSticky = true;
      if (headerStickyHeight === 60) {
        headerStickyHeight = headerWrapper.getBoundingClientRect().height;
      }

      observer.unobserve(headerWrapperWrapper);
      observer.observe(headerPlaceholder);

      return;
    }

    if (entry.target === headerPlaceholder && entry.intersectionRatio > 0.95) {
      headerPlaceholder.style.height = '';
      headerWrapperWrapper.classList.remove('header-sticky');
      headerWrapperWrapper.classList.remove('header-hide');
      headerWrapper.classList.remove('header-slide-in');

      headerWrapper.classList.add('header-hide');
      header.classList.add('header-slide-in');

      headerIsSticky = false;

      observer.unobserve(headerPlaceholder);
      observer.observe(headerWrapperWrapper);

      return;
    }
  });
};

let headerWidth = header.getBoundingClientRect().width;

window.addEventListener('resize', () => {
  const newWidth = header.getBoundingClientRect().width;

  if (headerWidth !== newWidth) {
    headerWidth = newWidth;

    if (headerIsSticky) {
      headerStickyHeight = headerWrapper.getBoundingClientRect().height;
    } else {
      headerStickyHeight = 60;
    }
  }
})

/*******************************************************************************
* Lazy loading images, video posters, map *
*******************************************************************************/

const lazyObserver = new IntersectionObserver(lazyLoad, {
  rootMargin: '250px',
  threshold: 0
});

// Observe each image
document.querySelectorAll('.lazy').forEach((element) => {
  lazyObserver.observe(element);
});

// Observe video posters
document.querySelectorAll('.videos-video').forEach((element) => {
  lazyObserver.observe(element);
});

// Observe map
lazyObserver.observe(document.querySelector('#contacts-map'));

// Change the "src" and stop observing
function lazyLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      if (entry.target.id === 'contacts-map') {
        document.querySelector('#contacts-map-script').src =
          document.querySelector('#contacts-map-script').dataset.src;

        document.querySelector('#contacts-map-script')
            .addEventListener('load', () => {
          ymaps.ready(() => {
            const myMap = new ymaps.Map('contacts-map', {
              center: [45.07682442, 39.01240056],
              zoom: 14,
              controls: []
            });

            myMap.geoObjects.add(new ymaps.Placemark(
              [45.07682442, 39.01240056],
              {},
              {
                preset: 'islands#homeIcon',
                iconColor: 'hsl(4, 77%, 41%)'
              }
            ));

            myMap.controls.add('geolocationControl', {
              size: 'small'
            });
            myMap.controls.add('zoomControl', {
              size: 'small'
            });
            myMap.controls.add('trafficControl', {
              size: 'large'
            });

            myMap.behaviors.disable(['scrollZoom', 'drag']);

            document.addEventListener('click', (event) => {
              if (document.querySelector('#contacts-map')
                  .contains(event.target)) {
                myMap.behaviors.enable(['scrollZoom', 'drag']);
              } else {
                myMap.behaviors.disable(['scrollZoom', 'drag']);
              }
            });
          });
        }, {once: true});
      } else if (entry.target.hasAttribute('data-src')) {
        entry.target.src = entry.target.dataset.src;
      } else if (entry.target.hasAttribute('data-poster')) {
        entry.target.poster = entry.target.dataset.poster;

        const shadow = window.getComputedStyle(entry.target.parentElement)
          .getPropertyValue('--color-shadow-dark');

        entry.target.parentElement.style.background =
          'linear-gradient(' + shadow + ', ' + shadow + '),' +
          'url("' + entry.target.poster + '") 50% 50%/cover';
      }

      observer.unobserve(entry.target);
    }
  });
};

/*******************************************************************************
* Smooth scroll to section *
*******************************************************************************/

function smoothScrollTo(pos, time) {
  if (time === undefined) {
    time = 500;
  }

  const startPos = window.scrollY;
  let startTime;
  let previousTimeStamp;

  const step = (timeStamp) => {
    if (startTime === undefined) {
      startTime = timeStamp;
    }

    const elapsedTime = timeStamp - startTime;

    if (previousTimeStamp !== timeStamp) {
      window.scroll(0, startPos + ((pos - startPos) * elapsedTime / time));
    }

    if (elapsedTime < time) {
      previousTimeStamp = timeStamp;
      window.requestAnimationFrame(step);
    } else {
      window.scroll(0, pos);
    }
  }

  window.requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    smoothScrollTo(document.querySelector(element.getAttribute('href'))
      .getBoundingClientRect().top + window.scrollY - headerStickyHeight);
  });
});

/*******************************************************************************
* Q&A *
*******************************************************************************/

let previouslyOpened;

document.querySelectorAll('.q-and-a-question').forEach((element) => {
  element.addEventListener('click', (event) => {
    if (previouslyOpened !== undefined && previouslyOpened !== element) {
      previouslyOpened.classList.remove('q-and-a-open');
      previouslyOpened.nextElementSibling.classList.remove('q-and-a-open');
    }

    if (!element.classList.contains('q-and-a-open')) {
      element.classList.add('q-and-a-open');
      element.nextElementSibling.classList.add('q-and-a-open');
      previouslyOpened = element;
    } else {
      element.classList.remove('q-and-a-open');
      element.nextElementSibling.classList.remove('q-and-a-open');
    }
  });
});

/*******************************************************************************
* Form *
*******************************************************************************/

const formWrapper = document.querySelector('.form-wrapper');

document.querySelectorAll('.call-back').forEach((element) => {
  element.addEventListener('click', () => {
    formWrapper.classList.add('form-shown');

    document.querySelector('.form-close').addEventListener('click', () => {
      formWrapper.classList.remove('form-shown');
    }, {once: true});
  });
});

const form = document.querySelector('.form');
const formPhone = document.querySelector('#form-phone');
const formName = document.querySelector('#form-name');
const formMessage = document.querySelector('#form-message');

form.addEventListener('submit', makeRequest);

function makeRequest(event) {
  event.preventDefault();

  const phone = formPhone.value;
  const name = formName.value;
  const message = formMessage.value;

  fetch('/', {
    method: 'post',
    headers: {
      "Content-type": "application/x-www-form-urlencoded"
    },
    body: 'phone=' + phone + '&' + 'name=' + name + '&' + 'message=' + message
  })
    .then((response) => {
      return response.text();
    })
    .then((responseText) => {
      document.querySelector('.form-time').textContent = currentTime() +
        responseText;
    });
}

function currentTime() {
  const today = new Date();
  const hh = today.getHours();
  const mm = today.getMinutes();
  const ss = today.getSeconds();
  const time = addZero(hh) + ':' + addZero(mm) + ':' + addZero(ss);

  return time;
}

function addZero(number) {
  if (number < 10) {
    number += '0';
  }

  return number;
}

/*******************************************************************************
* Photos *
*******************************************************************************/

const photosThumbnails = document.querySelectorAll('.photos-thumbnail');
const maxRowHeight = photosThumbnails[0].offsetHeight;
let photosGridWidth =
  document.querySelector('.photos-grid').getBoundingClientRect().width;

function setHeight() {
  const margin =
    parseFloat(window.getComputedStyle(
      document.querySelector('.photos-grid > *'))
      .getPropertyValue('margin-left')) +
    parseFloat(window.getComputedStyle(
      document.querySelector('.photos-grid > *'))
      .getPropertyValue('margin-right'));
  let index = 0;
  let lastImgReached = false;

  do {
    const rowStart = index;
    let currentLineWidth = 0;

    // Add images to row until they exceed row width
    do {
      photosThumbnails[index].style.height = '';

      currentLineWidth += photosThumbnails[index].getBoundingClientRect().width;
      currentLineWidth += margin;

      index += 1;

      if (index > photosThumbnails.length - 1) {
        lastImgReached = true;
      }
    } while (currentLineWidth < photosGridWidth && !lastImgReached);

    if (lastImgReached) {
      if (currentLineWidth < photosGridWidth) {
        document.querySelector('.photos-grid')
          .classList.add('photos-grid-short-last-row');
      } else {
        document.querySelector('.photos-grid')
          .classList.remove('photos-grid-short-last-row');
      }
    }

    const rowEnd = index;

    if (currentLineWidth > photosGridWidth) {
      const rowAspectRatio =  maxRowHeight /
        (currentLineWidth - margin * (rowEnd - rowStart));
      const height = rowAspectRatio *
        (photosGridWidth - margin * (rowEnd - rowStart));
      // For browsers other than Safari 14 "height - 0.05" seems enough
      const safeHeight = Math.max(height - 0.5, Math.floor(height));

      for (let i = rowStart; i < rowEnd; i++) {
        photosThumbnails[i].style.height = safeHeight + 'px';
      }
    }
  } while (!lastImgReached);
}

setHeight();

window.addEventListener('resize', () => {
  const newWidth =
    document.querySelector('.photos-grid').getBoundingClientRect().width;

  if (photosGridWidth !== newWidth) {
    photosGridWidth = newWidth;
    setHeight();
  }
});

/*******************************************************************************
* Slider *
*******************************************************************************/

const sliderSlides = document.querySelectorAll('.slider-slide');

// Load the current, prev, and next images
function sliderLazy(slide) {
  const load = (image) => {
    if (image.hasAttribute('data-src')) {
      image.src = image.dataset.src;

      image.removeAttribute('data-src');
    }
  }

  load(slide.querySelector('.slider-img'));

  let nextSlide;

  if (slide.nextElementSibling !== null &&
      slide.nextElementSibling.classList.contains('slider-slide')) {
    nextSlide = slide.nextElementSibling;
  } else {
    nextSlide = sliderSlides[0];
  }

  load(nextSlide.querySelector('.slider-img'));

  let prevSlide;

  if (slide.previousElementSibling !== null &&
      slide.previousElementSibling.classList.contains('slider-slide')) {
    prevSlide = slide.previousElementSibling;
  } else {
    prevSlide = sliderSlides[sliderSlides.length - 1];
  }

  load(prevSlide.querySelector('.slider-img'));
}

const slider = document.querySelector('.slider');
const sliderThumbnails = document.querySelectorAll('.photos-thumbnail-wrapper');
const sliderPosition = document.querySelector('.slider-position');
let sliderPositionNumber = 0;

// Open slider on thumbnail click
sliderThumbnails.forEach((element, index) => {
  element.addEventListener('click', () => {
    slider.classList.add('slider-shown');

    sliderSlides[index].classList.add('slider-current');

    sliderLazy(sliderSlides[index]);

    sliderPositionNumber = index + 1;
    sliderPosition.textContent =
      sliderPositionNumber + '/' + sliderSlides.length;

    sliderAddListeners();
  });
});

// Event listeners
function sliderAddListeners() {
  const sliderPrev = document.querySelector('.slider-prev');
  const sliderNext = document.querySelector('.slider-next');

  // Show prev slide
  const prevSlide = () => {
    const currentSlide = document.querySelector('.slider-current');

    currentSlide.classList.remove('slider-current');

    if (currentSlide.previousElementSibling !== null &&
        currentSlide.previousElementSibling.classList
          .contains('slider-slide')) {
      currentSlide.previousElementSibling.classList.add('slider-current');

      sliderLazy(currentSlide.previousElementSibling);

      sliderPositionNumber -= 1;
      sliderPosition.textContent =
        sliderPositionNumber + '/' + sliderSlides.length;
    } else {
      sliderSlides[sliderSlides.length - 1].classList.add('slider-current');

      sliderLazy(sliderSlides[sliderSlides.length - 1]);

      sliderPositionNumber = sliderSlides.length;
      sliderPosition.textContent =
        sliderPositionNumber + '/' + sliderSlides.length;
    }
  }

  sliderPrev.addEventListener('click', prevSlide);

  // Show next slide
  const nextSlide = () => {
    const currentSlide = document.querySelector('.slider-current');

    currentSlide.classList.remove('slider-current');

    if (currentSlide.nextElementSibling !== null &&
        currentSlide.nextElementSibling.classList.contains('slider-slide')) {
      currentSlide.nextElementSibling.classList.add('slider-current');

      sliderLazy(currentSlide.nextElementSibling);

      sliderPositionNumber += 1;
      sliderPosition.textContent =
        sliderPositionNumber + '/' + sliderSlides.length;
    } else {
      sliderSlides[0].classList.add('slider-current');

      sliderLazy(sliderSlides[0]);

      sliderPositionNumber = 1;
      sliderPosition.textContent =
        sliderPositionNumber + '/' + sliderSlides.length;
    }
  }

  sliderNext.addEventListener('click', nextSlide);

  const preventDefault = (event) => {
    event.preventDefault();
  }

  // Disable context menu
  slider.addEventListener('contextmenu', preventDefault);

  // Disable scrolling
  slider.addEventListener('touchmove', preventDefault, {passive: false});

  let controlsHidden = false;

  // Swipe
  const swipeSlide = (event) => {
    let startPos = event.touches[0].clientX;

    slider.addEventListener('touchend', (event) => {
      let endPos = event.changedTouches[0].clientX;
      let movedX = startPos - endPos;

      if (Math.abs(movedX) > 10) {
        if (movedX > 0) {
          nextSlide();
        } else {
          prevSlide();
        }

        slider.classList.add('slider-hide-controls');
        controlsHidden = true;

        // Show controls on click or tap
        slider.addEventListener('click', (event) => {
          if (controlsHidden) {
            slider.classList.remove('slider-hide-controls');
            controlsHidden = false;
          }
        }, {once: true});

        // Show controls on mouse move
        slider.addEventListener('mousemove', () => {
          if (controlsHidden) {
            slider.classList.remove('slider-hide-controls');
            controlsHidden = false;
          }
        }, {once: true});
      }
    }, {once: true});
  }

  slider.addEventListener('touchstart', swipeSlide, {passive: true});

  // Remove event listeners
  const sliderRemoveListeners = () => {
    sliderPrev.removeEventListener('click', prevSlide);
    sliderNext.removeEventListener('click', nextSlide);
    slider.removeEventListener('contextmenu', preventDefault);
    slider.removeEventListener('touchmove', preventDefault, {passive: false});
    slider.removeEventListener('touchstart', swipeSlide, {passive: true});
    document.removeEventListener('keydown', keyboardNav);
    sliderClose.removeEventListener('click', closeSlider);
  }

  // Close slider
  const closeSlider = () => {
    slider.classList.remove('slider-shown');

    const currentSlide = document.querySelector('.slider-current');
    currentSlide.classList.remove('slider-current');

    sliderRemoveListeners();
  }

  // Keyboard navigation
  const keyboardNav = (event) => {
    if (event.key === 'ArrowLeft') {
      prevSlide();
    }

    if (event.key === 'ArrowRight') {
      nextSlide();
    }

    if (event.key === 'Escape') {
      closeSlider();
    }
  }

  document.addEventListener('keydown', keyboardNav);

  const sliderClose = document.querySelector('.slider-close');
  sliderClose.addEventListener('click', closeSlider);
}