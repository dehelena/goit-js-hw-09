import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const inputEl = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('button[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');
const timerEl = document.querySelector('.timer');

let intervalId = null;
startBtn.disabled = true;
let selectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];
    if (selectedDate <= Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      return;
    }
    startBtn.disabled = false;
  },
};

const fp = flatpickr(inputEl, options);

function onStartBtnClick(e) {
  intervalId = setInterval(() => {
    const diff = selectedDate - Date.now();

    if (diff <= 0) {
      clearInterval(intervalId);
      return;
    }

    const { days, hours, minutes, seconds } = convertMs(diff);
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
  }, 1000);
}

//функція конвертації
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(
    Math.floor((((ms % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

//додаємо нулі
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

startBtn.addEventListener('click', onStartBtnClick);
