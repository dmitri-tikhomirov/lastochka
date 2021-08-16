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
  }, 1);
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
      const navDropdownLinks =
        document.querySelectorAll('.nav-dropdown a[href]');

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

const navAdapt = () => {
  // Reveal all items before calculation
  navItems.forEach((item) => {
    item.classList.remove('hide');
  });

  navDropdownItems.forEach((item) => {
    item.classList.remove('hide');
  });

  navMoreAndDropdown.style.display = 'block';

  const navWidth = document.querySelector('.nav').offsetWidth;
  let navMoreWidth = navMoreAndDropdown.offsetWidth +
    parseFloat(window.getComputedStyle(navMoreAndDropdown)
      .getPropertyValue('margin-left'));
  let stopWidth = navMoreWidth;
  let navHiddenItems = [];
  let stopReached = false;

  // Hide nav items that don't fit
  navItems.forEach((item, index, array) => {
    if (stopReached === false) {
      let itemMargin = parseFloat(window.getComputedStyle(item)
        .getPropertyValue('margin-left'));

      // Try to fit the last item without "more"
      if (index === array.length - 1) {
        stopWidth -= navMoreWidth;
      }

      if (navWidth >= stopWidth + item.offsetWidth + itemMargin) {
        stopWidth = stopWidth + item.offsetWidth + itemMargin;
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
window.addEventListener('resize', navAdapt);

/*******************************************************************************
* Sticky shrinking header *
*******************************************************************************/

const header = document.querySelector('.header');
const headerWrapper = document.querySelector('.header-wrapper');
const headerWrapperWrapper = document.querySelector('.header-wrapper-wrapper');
const headerPlaceholder = document.querySelector('.header-placeholder');

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

      headerPlaceholder.style.height = header.offsetHeight + 'px';
      headerWrapperWrapper.classList.add('header-sticky');
      headerWrapperWrapper.classList.add('header-hide');
      headerWrapper.classList.add('header-slide-in');

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

      observer.unobserve(headerPlaceholder);
      observer.observe(headerWrapperWrapper);

      return;
    }
  });
};

/*******************************************************************************
* Lazy loading images *
*******************************************************************************/

const lazyObserver = new IntersectionObserver(lazyLoad, {
  rootMargin: '250px',
  threshold: 0
});

// Observe each image
document.querySelectorAll('.lazy').forEach((element) => {
  lazyObserver.observe(element);
});

// Change the "src" and stop observing
function lazyLoad(entries, observer) {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.src = entry.target.dataset.src;
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

headerWrapperWrapper.classList.add('header-sticky');
const headerStickyHeight = headerWrapper.offsetHeight;
headerWrapperWrapper.classList.remove('header-sticky');

document.querySelectorAll('a[href^="#"]').forEach((element) => {
  element.addEventListener('click', (event) => {
    event.preventDefault();

    smoothScrollTo(document.querySelector(
      element.getAttribute('href')).offsetTop - headerStickyHeight);
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