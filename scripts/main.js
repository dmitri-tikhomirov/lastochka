/*******************************************************************************
* Navigation *
*******************************************************************************/

const navMoreAndDropdown = document.querySelector('.nav-more-and-dropdown');
const navDropdownHoverable = document.querySelector('.nav-dropdown-hoverable');
const navMore = document.querySelector('.nav-more');
const navMoreIcon = document.querySelector('.nav-more-icon');
const navMobileIcon = document.querySelector('.nav-mobile-icon');
const navCloseIcon = document.querySelector('.nav-close-icon');
let dropdownOpened = false;
let dropdownJustOpenedByMouseEnter = false;

function openDropdown() {
  navDropdownHoverable.style.opacity = '1';
  navDropdownHoverable.style.visibility = 'visible';
  navMore.style.opacity =
    window.getComputedStyle(navMore).getPropertyValue('--opacity-l');
  navMoreIcon.style.transform = 'rotate(180deg)';
  navMobileIcon.style.opacity = '0';
  navCloseIcon.style.opacity =
    window.getComputedStyle(navCloseIcon).getPropertyValue('--opacity-l');
  dropdownOpened = true;
}

function closeDropdown() {
  navDropdownHoverable.style.opacity = '';
  navDropdownHoverable.style.visibility = '';
  navMore.style.opacity = '';
  navMoreIcon.style.transform = '';
  navMobileIcon.style.opacity = '';
  navCloseIcon.style.opacity = '';
  dropdownOpened = false;
}

navMoreAndDropdown.addEventListener('mouseenter', (event) => {
  openDropdown();
  dropdownJustOpenedByMouseEnter = true;
  setTimeout(() => {
    dropdownJustOpenedByMouseEnter = false;
  }, 1);
});

navMoreAndDropdown.addEventListener('mouseleave', (event) => {
  if (dropdownOpened) {
    closeDropdown();
  }
});

document.addEventListener('click', (event) => {
  if (dropdownJustOpenedByMouseEnter) {
    return;
  }
  // Add hover effects on tap
  if (!dropdownOpened && navMoreAndDropdown.contains(event.target)) {
    openDropdown();
    return;
  }
  // Remove hover effects on outside tap
  if (dropdownOpened) {
    if (!navDropdownHoverable.contains(event.target)) {
      closeDropdown();
      return;
    } else {
      // Remove hover effects on tapping or clicking a link
      const navDropdownLinks = document.querySelectorAll('.nav-dropdown a');
      navDropdownLinks.forEach((element) => {
        if (element.contains(event.target)) {
          closeDropdown();
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

// Hide nav and dropdown items
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

  // Hide nav items that don't fit
  const navWidth = document.querySelector('.nav').offsetWidth;
  let navMoreWidth = navMoreAndDropdown.offsetWidth;
  let stopWidth = navMoreWidth;
  let navHiddenItems = [];
  let stopReached = false;

  navItems.forEach((item, index, array) => {
    if (stopReached === false) {
      // Try to fit the last item without "more"
      if (index === array.length - 1) {
        stopWidth -= navMoreWidth;
      }
      if (navWidth >= stopWidth + item.offsetWidth) {
        stopWidth = stopWidth + item.offsetWidth;
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