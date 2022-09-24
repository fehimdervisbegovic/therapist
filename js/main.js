import anime from "animejs";

/* Page containers */
const bodyContainer = document.querySelector('body');
const headerFixed = document.querySelector('.js-header');


/* Buttons */
const filterButtonToggles = document.querySelectorAll('.js-filter-btn');
const closeButtons = Array.from(document.querySelectorAll('.js-close'));
const bookButton = document.querySelector('.js-book');
const therapistItems = document.querySelectorAll('.js-therapist-item');
const paymentButton = document.querySelector('.js-payment-button');

/* Data prop for DEMO*/
let selectedTherapist = {
  name : "",
  image : "",
  price : 0,
};

function changeDataForSelectedTherapist() {
  const therapistImagePreview = document.querySelector('.js-therapist-image-preview');
  const therapistPricePreview = document.querySelector('.js-therapist-price-preview');
  const therapistNamePreview = document.querySelector('.js-therapist-name-preview');

  const therapistNameBooking = document.querySelector('.js-therapist-name-booking');

  const therapistImageBookingConfirmation = document.querySelector('.js-therapist-image-booking-confirmation');
  const therapistNameBookingConfirmation = document.querySelector('.js-therapist-name-booking-confirmation');
  const therapistNameBookingConfirmationUpSale = document.querySelector('.js-therapist-name-booking-confirmation-up-sale');

  therapistImagePreview.src = selectedTherapist.image;
  therapistPricePreview.innerHTML = `${selectedTherapist.price}`;
  therapistNamePreview.innerHTML = selectedTherapist.name;

  therapistNameBooking.innerHTML = selectedTherapist.name;

  therapistImageBookingConfirmation.src = selectedTherapist.image;
  therapistNameBookingConfirmation.innerHTML = selectedTherapist.name;
  therapistNameBookingConfirmationUpSale.innerHTML = selectedTherapist.name;
}

function setSelectedTherapist(itemDOM) {
  selectedTherapist.name = itemDOM.querySelector('[data-name]').innerHTML;
  selectedTherapist.image = itemDOM.querySelector('[data-image]').src;
  selectedTherapist.price = itemDOM.querySelector('[data-price]').innerHTML;
  changeDataForSelectedTherapist()
}

/* Overlays */
const filterBlock = document.querySelector('.js-filter-block');
const therapistPreviewBlock = document.querySelector('.js-therapist-preview');
const bookingBlock = document.querySelector('.js-booking');
const bookingConfirmationBlock = document.querySelector('.js-booking-confirmation');


/* Utils */
const windowWidth = window.screen.width;
const windowHeight = window.screen.height;
const randomBoolean = arr => arr[Math.floor(Math.random() * arr.length)];

let activeOverlay = [];


/* Click handlers */
function openOverlay(overlayBlock, setBodyToUnscrollable = false, completeHandler = () => {}) {
  if(setBodyToUnscrollable)
    bodyContainer.classList.add('noscroll');
  anime({
    targets: overlayBlock,
    translateX: [windowWidth, 0],
    duration: 900,
    easing: 'easeInOutQuint',
    complete: function () {
      completeHandler()
      activeOverlay.push(overlayBlock);
    }
  })
}
function closeOverlay(beginHandler = () => {},completeHandler = () => {}) {
  anime({
    targets: activeOverlay.pop(),
    translateX: [0, windowWidth],
    duration: 900,
    easing: 'easeInOutQuint',
    begin: function () {
      beginHandler();
    },
    complete: function () {
      completeHandler();
      if(activeOverlay.length === 0)
        bodyContainer.classList.remove('noscroll');
    }
  })
}
paymentButton.addEventListener('click', () => openOverlay(bookingConfirmationBlock, false, () => {
  while(activeOverlay.length !== 0) {
    activeOverlay.pop().style.transform = `translateX(${windowWidth}px)`;
  }
}))
bookButton.addEventListener('click', () => openOverlay(bookingBlock));
therapistItems.forEach(item => item.addEventListener('click', () => {setSelectedTherapist(item); openOverlay(therapistPreviewBlock, true)}))
filterButtonToggles.forEach(item => item.addEventListener('click', () => openOverlay(filterBlock, true)))
closeButtons.forEach(item => item.addEventListener('click', () => closeOverlay(() => {
  activeOverlay.forEach(item => {
    item.firstElementChild.scrollTop = 0;
  })
}, () => {
  dateTimeInfoCarousel.style.transform = `translateX(0px)`;
})))

/* Header on scroll */
let options = {
  rootMargin: '0px',
  threshold: 0
}

let callback = (entries, observer) => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) {
      anime({
        targets: headerFixed,
        duration: 700,
        translateY: 0,
        easing: 'easeOutExpo'
      })
    }
    if(entry.isIntersecting) {
      anime({
        targets: headerFixed,
        duration: 700,
        translateY: -headerFixed.clientHeight,
        easing: 'easeOutExpo'
      })
    }
  });
};

let observer = new IntersectionObserver(callback, options);
let target = document.querySelector('.js-results-nav');
observer.observe(target);


/* * * * * * * * * * *
* * * * Carousel
* * * * * * * * * * */
const dateTimeInfoCarousel = document.querySelector('.js-carousel');
const carouselBackButton = document.querySelector('.js-carousel-back-button');
const carouselItemWidth = dateTimeInfoCarousel.querySelector('div').clientWidth;

let carouselOrder = 0;
carouselBackButton.addEventListener('click', () => {
  anime({
    targets: dateTimeInfoCarousel,
    translateX: {
      value: `+=${carouselItemWidth}px`,
      duration: 500
    },
    easing: 'easeOutQuint',
    complete: function () {
      carouselOrder--;
      if(carouselOrder === 0)
        carouselBackButton.setAttribute("disabled", true);
    }
  })
})


/* Calendar */
const currentMonthLabel = document.querySelector('.js-month-picker');
const calendarMonth = document.querySelector('.js-day-picker');


// Calendar buttons
const previousMonthButton = document.querySelector('.js-previous-date-button');
const nextMonthButton = document.querySelector('.js-next-date-button');
let availableDaysButtons = [];
let presentDate = new Date();
let selectedDate = new Date();


// Calendar utils
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


// Calendar functions
function getAllDaysInMonth(year, month) {
  const date = new Date(year, month, 1);

  const dates = [];

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
}
function setAvailableDas(days) {
  availableDaysButtons = days;
  availableDaysButtons.forEach(item => item.addEventListener('click', () => {
    anime({
      targets: dateTimeInfoCarousel,
      translateX: {
        value: `-=${carouselItemWidth}px`,
        duration: 500
      },
      easing: 'easeOutQuint',
      complete: function () {
        carouselBackButton.removeAttribute("disabled");
        carouselOrder++;
      }
    })
  }))
}
function fillDaysInCalendarDOM(days) {
  calendarMonth.innerHTML = "";
  const selectedMontAvailableDays = [];
  if(days[0].getDay() !== 1) {
    for(let i = 0; i < days[0].getDay() - 1; i++) {
      let dayDOM = document.createElement('div');
      dayDOM.classList.add("day-picker__day");
      calendarMonth.appendChild(dayDOM);
    }
  }
  days.forEach(day => {
    let dayDOM = document.createElement('div');
    dayDOM.classList.add("day-picker__day");
    if(randomBoolean([true,false])) {
      dayDOM.classList.add("day-picker__day--available")
      dayDOM.classList.add("js-available-day")
      selectedMontAvailableDays.push(dayDOM);
    }
    dayDOM.innerHTML = day.getDate();
    calendarMonth.appendChild(dayDOM)
  })
  setAvailableDas(selectedMontAvailableDays);
}
function changeDateHandler() {
  currentMonthLabel.innerHTML = months[selectedDate.getMonth()] + " " + selectedDate.getFullYear();

  let selectedMonth = getAllDaysInMonth(selectedDate.getFullYear(), selectedDate.getMonth());
  fillDaysInCalendarDOM(selectedMonth);

  if(selectedDate.getTime() === presentDate.getTime())
    previousMonthButton.setAttribute("disabled", true);
  else
    previousMonthButton.removeAttribute("disabled");
}


// Initial setup
currentMonthLabel.innerHTML = months[presentDate.getMonth()] + " " + presentDate.getFullYear();
const presentMonthDays = getAllDaysInMonth(presentDate.getFullYear(), presentDate.getMonth());
fillDaysInCalendarDOM(presentMonthDays);


// Click handlers
previousMonthButton.addEventListener('click', () => {
  selectedDate.setMonth(selectedDate.getMonth() - 1);
  changeDateHandler();
})
nextMonthButton.addEventListener('click', () => {
  selectedDate.setMonth(selectedDate.getMonth() + 1);
  changeDateHandler();
})


/* Time picker */
const timePickerTimes = Array.from(document.querySelectorAll('.js-time-picker'));
timePickerTimes.forEach(item => item.addEventListener('click', () => {
  anime({
    targets: dateTimeInfoCarousel,
    translateX: {
      value: `-=${carouselItemWidth}px`,
      duration: 500
    },
    easing: 'easeOutQuint',
    complete: function () {
      carouselOrder++;
    }
  })
}))
