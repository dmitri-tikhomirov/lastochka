function tabHandler(e){"Tab"===e.key&&(document.body.classList.add("user-is-tabbing"),window.removeEventListener("keydown",tabHandler),window.addEventListener("mousedown",mouseDownHandler))}function mouseDownHandler(){document.body.classList.remove("user-is-tabbing"),window.removeEventListener("mousedown",mouseDownHandler),window.addEventListener("keydown",tabHandler)}window.addEventListener("keydown",tabHandler);const navMoreAndDropdown=document.querySelector(".nav-more-and-dropdown"),navDropdown=document.querySelector(".nav-dropdown"),navMore=document.querySelector(".nav-more"),navMoreIcon=document.querySelector(".nav-more-icon"),navMobileIcon=document.querySelector(".nav-mobile-icon"),navCloseIcon=document.querySelector(".nav-close-icon");let dropdownOpened=!1,dropdownJustOpenedByMouseEnter=!1;navMoreAndDropdown.addEventListener("mouseenter",e=>{navMoreAndDropdown.classList.add("nav-dropdown-open"),dropdownOpened=!0,dropdownJustOpenedByMouseEnter=!0,setTimeout(()=>{dropdownJustOpenedByMouseEnter=!1},100)}),navMoreAndDropdown.addEventListener("mouseleave",e=>{dropdownOpened&&(navMoreAndDropdown.classList.remove("nav-dropdown-open"),dropdownOpened=!1)}),document.addEventListener("click",e=>{if(!dropdownJustOpenedByMouseEnter){if(!dropdownOpened&&navMoreAndDropdown.contains(e.target))return navMoreAndDropdown.classList.add("nav-dropdown-open"),void(dropdownOpened=!0);if(dropdownOpened){if(!navDropdown.contains(e.target))return navMoreAndDropdown.classList.remove("nav-dropdown-open"),void(dropdownOpened=!1);navDropdown.querySelectorAll("a[href], button").forEach(t=>{if(t.contains(e.target))return navMoreAndDropdown.classList.remove("nav-dropdown-open"),void(dropdownOpened=!1)})}}}),document.querySelector(".nav").classList.remove("nav-no-javascript");const navItems=document.querySelectorAll(".nav-item"),navDropdownItems=document.querySelectorAll(".nav-item-dropdown");let navWidth=document.querySelector(".nav").getBoundingClientRect().width;const navAdapt=()=>{navItems.forEach(e=>{e.classList.remove("hide")}),navDropdownItems.forEach(e=>{e.classList.remove("hide")}),navMoreAndDropdown.style.display="block";const e=navMoreAndDropdown.getBoundingClientRect().width+parseFloat(window.getComputedStyle(navMoreAndDropdown).getPropertyValue("margin-left")),t=[];let r=e,o=!1;navItems.forEach((n,s,d)=>{if(!1===o){const t=parseFloat(window.getComputedStyle(n).getPropertyValue("margin-left"));s===d.length-1&&(r-=e),navWidth>=r+n.getBoundingClientRect().width+t?r=r+n.getBoundingClientRect().width+t:o=!0}!0===o&&(n.classList.add("hide"),t.push(s))}),t.length?navDropdownItems.forEach((e,r)=>{t.includes(r)||e.classList.add("hide")}):navMoreAndDropdown.style.display=""};navAdapt(),window.addEventListener("resize",()=>{const e=document.querySelector(".nav").getBoundingClientRect().width;navWidth!==e&&(navWidth=e,navAdapt())});const header=document.querySelector(".header"),headerWrapper=document.querySelector(".header-wrapper"),headerWrapperWrapper=document.querySelector(".header-wrapper-wrapper"),headerPlaceholder=document.querySelector(".header-placeholder");let headerIsSticky=!1;const headerObserver=new IntersectionObserver(sticky,{threshold:.95});function sticky(e,t){e.forEach(e=>e.target===headerWrapperWrapper&&e.intersectionRatio<.95?(headerWrapper.classList.remove("header-hide"),header.classList.remove("header-slide-in"),headerPlaceholder.style.height=header.getBoundingClientRect().height+"px",headerWrapperWrapper.classList.add("header-sticky"),headerWrapperWrapper.classList.add("header-hide"),headerWrapper.classList.add("header-slide-in"),headerIsSticky=!0,t.unobserve(headerWrapperWrapper),void t.observe(headerPlaceholder)):e.target===headerPlaceholder&&e.intersectionRatio>.95?(headerPlaceholder.style.height="",headerWrapperWrapper.classList.remove("header-sticky"),headerWrapperWrapper.classList.remove("header-hide"),headerWrapper.classList.remove("header-slide-in"),headerWrapper.classList.add("header-hide"),header.classList.add("header-slide-in"),headerIsSticky=!1,t.unobserve(headerPlaceholder),void t.observe(headerWrapperWrapper)):void 0)}headerObserver.observe(headerWrapperWrapper);const sectionLinks=document.querySelectorAll('a[href^="#"]');let headerStickyHeight=0;function setSectionOffset(){headerIsSticky?headerStickyHeight=headerWrapper.getBoundingClientRect().height:(headerWrapperWrapper.classList.add("header-sticky"),headerStickyHeight=headerWrapper.getBoundingClientRect().height,headerWrapperWrapper.classList.remove("header-sticky")),sectionLinks.forEach(e=>{if("#"!==e.getAttribute("href")){const t=document.querySelector(e.getAttribute("href"));t.classList.add("sectionWithOffset"),t.parentElement.classList.add("sectionWithOffsetParent"),t.style.top=-headerStickyHeight+"px"}})}setSectionOffset();let headerWidth=header.getBoundingClientRect().width;window.addEventListener("resize",()=>{const e=header.getBoundingClientRect().width;headerWidth!==e&&(headerWidth=e,setSectionOffset())});const lazyObserver=new IntersectionObserver(lazyLoad,{rootMargin:"250px",threshold:0});function lazyLoad(e,t){e.forEach(e=>{if(e.intersectionRatio>0){if("contacts-map"===e.target.id)document.querySelector("#contacts-map-script").src=document.querySelector("#contacts-map-script").dataset.src,document.querySelector("#contacts-map-script").addEventListener("load",()=>{ymaps.ready(()=>{const e=new ymaps.Map("contacts-map",{center:[45.07682442,39.01240056],zoom:14,controls:[]});e.geoObjects.add(new ymaps.Placemark([45.07682442,39.01240056],{},{preset:"islands#homeIcon",iconColor:"hsl(4, 77%, 41%)"})),e.controls.add("geolocationControl",{size:"small"}),e.controls.add("zoomControl",{size:"small"}),e.controls.add("trafficControl",{size:"large"}),e.behaviors.disable(["scrollZoom","drag"]),document.addEventListener("click",t=>{document.querySelector("#contacts-map").contains(t.target)?e.behaviors.enable(["scrollZoom","drag"]):e.behaviors.disable(["scrollZoom","drag"])})})},{once:!0});else if(e.target.hasAttribute("data-src"))e.target.src=e.target.dataset.src;else if(e.target.hasAttribute("data-poster")){e.target.poster=e.target.dataset.poster;const t=window.getComputedStyle(e.target.parentElement).getPropertyValue("--color-shadow-dark");e.target.parentElement.style.background="linear-gradient("+t+", "+t+'),url("'+e.target.poster+'") 50% 50%/cover'}t.unobserve(e.target)}})}function smoothScrollTo(e,t){void 0===t&&(t=500);const r=window.scrollY;let o,n;const s=d=>{void 0===o&&(o=d);const i=d-o;n!==d&&window.scroll(0,r+(e-r)*i/t),i<t?(n=d,window.requestAnimationFrame(s)):window.scroll(0,e)};window.requestAnimationFrame(s)}let previouslyOpened;function currentTime(){const e=new Date,t=e.getHours(),r=e.getMinutes(),o=e.getSeconds();return addZero(t)+":"+addZero(r)+":"+addZero(o)}function addZero(e){return e<10&&(e="0"+e),e}document.querySelectorAll(".lazy").forEach(e=>{lazyObserver.observe(e)}),document.querySelectorAll(".videos-video").forEach(e=>{lazyObserver.observe(e)}),lazyObserver.observe(document.querySelector("#contacts-map")),sectionLinks.forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),"#"!==e.getAttribute("href")?(smoothScrollTo(document.querySelector(e.getAttribute("href")).getBoundingClientRect().top+window.scrollY),window.history.pushState({},document.title,e.getAttribute("href"))):(smoothScrollTo(0),window.history.pushState({},document.title,"/"))})}),document.querySelectorAll(".q-and-a-question").forEach(e=>{e.addEventListener("click",t=>{void 0!==previouslyOpened&&previouslyOpened!==e&&(previouslyOpened.classList.remove("q-and-a-open"),previouslyOpened.nextElementSibling.classList.remove("q-and-a-open")),e.classList.contains("q-and-a-open")?(e.classList.remove("q-and-a-open"),e.nextElementSibling.classList.remove("q-and-a-open")):(e.classList.add("q-and-a-open"),e.nextElementSibling.classList.add("q-and-a-open"),previouslyOpened=e)})}),document.querySelectorAll(".call-back").forEach(e=>{e.addEventListener("click",()=>{const e=document.querySelector(".form-wrapper");e.classList.add("form-shown");const t=document.querySelector(".form"),r=()=>{e.classList.remove("form-shown"),t.removeEventListener("submit",n),o.removeEventListener("click",r)},o=document.querySelector(".form-close");o.addEventListener("click",r);const n=s=>{s.preventDefault();const d=document.querySelector("#form-phone").value,i=document.querySelector("#form-name").value,l=document.querySelector("#form-message").value,a=document.querySelector(".form-error"),c=document.querySelector(".form-btn");c.setAttribute("disabled",""),a.textContent="Отправляем...",fetch("/message",{method:"post",headers:{"Content-type":"application/x-www-form-urlencoded"},body:"phone="+d+"&name="+i+"&message="+l}).then(e=>e.text()).then(s=>{if("Email sent"===s){a.textContent="",e.classList.remove("form-shown"),t.removeEventListener("submit",n),o.removeEventListener("click",r);const s=document.querySelector(".form-sent-wrapper");s.classList.add("form-shown"),document.querySelector(".form-sent-time").textContent=currentTime(),document.querySelector(".form-sent-close").addEventListener("click",()=>{s.classList.remove("form-shown")},{once:!0})}else a.textContent="Email not sent"===s?"Ошибка доставки":"Ошибка сервера";c.removeAttribute("disabled")}).catch(()=>{a.textContent="Ошибка сети",c.removeAttribute("disabled")})};t.addEventListener("submit",n)})});const photosThumbnails=document.querySelectorAll(".photos-thumbnail"),maxRowHeight=photosThumbnails[0].offsetHeight;let photosGridWidth=document.querySelector(".photos-grid").getBoundingClientRect().width;function setHeight(){const e=parseFloat(window.getComputedStyle(document.querySelector(".photos-grid > *")).getPropertyValue("margin-left"))+parseFloat(window.getComputedStyle(document.querySelector(".photos-grid > *")).getPropertyValue("margin-right"));let t=0,r=!1;do{const o=t;let n=0;do{photosThumbnails[t].style.height="",n+=photosThumbnails[t].getBoundingClientRect().width,n+=e,(t+=1)>photosThumbnails.length-1&&(r=!0)}while(n<photosGridWidth&&!r);r&&(n<photosGridWidth?document.querySelector(".photos-grid").classList.add("photos-grid-short-last-row"):document.querySelector(".photos-grid").classList.remove("photos-grid-short-last-row"));const s=t;if(n>photosGridWidth){let t=(photosGridWidth-e*(s-o))/((n-e*(s-o))/maxRowHeight);do{n=0;for(let r=o;r<s;r++)photosThumbnails[r].style.height=t+"px",n+=photosThumbnails[r].getBoundingClientRect().width,n+=e;t-=.01}while(n>photosGridWidth)}}while(!r)}setHeight(),window.addEventListener("resize",()=>{const e=document.querySelector(".photos-grid").getBoundingClientRect().width;photosGridWidth!==e&&(photosGridWidth=e,setHeight())});const sliderSlides=document.querySelectorAll(".slider-slide");function sliderLazy(e){const t=e=>{e.hasAttribute("data-src")&&(e.src=e.dataset.src,e.removeAttribute("data-src"))};let r,o;t(e.querySelector(".slider-img")),t((r=null!==e.nextElementSibling&&e.nextElementSibling.classList.contains("slider-slide")?e.nextElementSibling:sliderSlides[0]).querySelector(".slider-img")),t((o=null!==e.previousElementSibling&&e.previousElementSibling.classList.contains("slider-slide")?e.previousElementSibling:sliderSlides[sliderSlides.length-1]).querySelector(".slider-img"))}const slider=document.querySelector(".slider"),sliderThumbnails=document.querySelectorAll(".photos-thumbnail-wrapper"),sliderPosition=document.querySelector(".slider-position");let sliderPositionNumber=0;function sliderAddListeners(){const e=document.querySelector(".slider-prev"),t=document.querySelector(".slider-next"),r=()=>{const e=document.querySelector(".slider-current");e.classList.remove("slider-current"),null!==e.previousElementSibling&&e.previousElementSibling.classList.contains("slider-slide")?(e.previousElementSibling.classList.add("slider-current"),sliderLazy(e.previousElementSibling),sliderPositionNumber-=1,sliderPosition.textContent=sliderPositionNumber+"/"+sliderSlides.length):(sliderSlides[sliderSlides.length-1].classList.add("slider-current"),sliderLazy(sliderSlides[sliderSlides.length-1]),sliderPositionNumber=sliderSlides.length,sliderPosition.textContent=sliderPositionNumber+"/"+sliderSlides.length)};e.addEventListener("click",r);const o=()=>{const e=document.querySelector(".slider-current");e.classList.remove("slider-current"),null!==e.nextElementSibling&&e.nextElementSibling.classList.contains("slider-slide")?(e.nextElementSibling.classList.add("slider-current"),sliderLazy(e.nextElementSibling),sliderPositionNumber+=1,sliderPosition.textContent=sliderPositionNumber+"/"+sliderSlides.length):(sliderSlides[0].classList.add("slider-current"),sliderLazy(sliderSlides[0]),sliderPositionNumber=1,sliderPosition.textContent=sliderPositionNumber+"/"+sliderSlides.length)};t.addEventListener("click",o);const n=e=>{e.preventDefault()};slider.addEventListener("contextmenu",n),slider.addEventListener("touchmove",n,{passive:!1});let s=!1;const d=e=>{let t=e.touches[0].clientX;slider.addEventListener("touchend",e=>{let n=e.changedTouches[0].clientX,d=t-n;Math.abs(d)>10&&(d>0?o():r(),slider.classList.add("slider-hide-controls"),s=!0,slider.addEventListener("click",e=>{s&&(slider.classList.remove("slider-hide-controls"),s=!1)},{once:!0}),slider.addEventListener("mousemove",()=>{s&&(slider.classList.remove("slider-hide-controls"),s=!1)},{once:!0}))},{once:!0})};slider.addEventListener("touchstart",d,{passive:!0});const i=()=>{slider.classList.remove("slider-shown"),document.querySelector(".slider-current").classList.remove("slider-current"),e.removeEventListener("click",r),t.removeEventListener("click",o),slider.removeEventListener("contextmenu",n),slider.removeEventListener("touchmove",n,{passive:!1}),slider.removeEventListener("touchstart",d,{passive:!0}),document.removeEventListener("keydown",l),a.removeEventListener("click",i)},l=e=>{"ArrowLeft"===e.key&&r(),"ArrowRight"===e.key&&o(),"Escape"===e.key&&i()};document.addEventListener("keydown",l);const a=document.querySelector(".slider-close");a.addEventListener("click",i)}sliderThumbnails.forEach((e,t)=>{e.addEventListener("click",()=>{slider.classList.add("slider-shown"),sliderSlides[t].classList.add("slider-current"),sliderLazy(sliderSlides[t]),sliderPositionNumber=t+1,sliderPosition.textContent=sliderPositionNumber+"/"+sliderSlides.length,sliderAddListeners()})});