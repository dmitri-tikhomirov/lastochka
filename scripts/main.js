// Priority navigation
if (window.matchMedia('(min-width: 481px)').matches) {
  // Remove CSS fallback used if no JavaScript is available
  document.querySelector('nav').classList.remove('nav-no-javascript');

  // Hide nav and dropdown items
  const navItems = document.querySelectorAll('nav > a:not(.nav-mobile)');
  const navMoreAndDropdown = document.querySelector('.nav-more-and-dropdown');
  const navDropdownHover = document.querySelector('.nav-dropdown-hover');
  const navDropdownIcon = document.querySelector('.nav-dropdown-icon');
  const navDropdownItems = document.querySelectorAll('.nav-dropdown > a');

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
    const navWidth = document.querySelector('nav').offsetWidth;
    let navMoreWidth = navMoreAndDropdown.offsetWidth +
                      parseFloat(window.getComputedStyle(navMoreAndDropdown)
                                        .getPropertyValue('margin-left'));
    let stopWidth = navMoreWidth;
    let navHiddenItems = [];
    let stopReached = false;

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

  navAdapt(); // Adapt on load
  window.addEventListener('resize', navAdapt); // Adapt on window resize
}