import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('.input-btn');
const dateInput = document.querySelector('#datetime-picker');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.disabled = true;

let selectedDate = null;
let timerId = null;

flatpickr('#datetime-picker', {
  dateFormat: 'Y-m-d H:i',
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  onClose(selectedDates) {
    selectedDate = selectedDates[0];

    if (selectedDate <= new Date()) {
      iziToast.error({
        title: 'Помилка',
        message: 'Будь ласка, оберіть дату в майбутньому',
        position: 'topRight',
        timeout: 4000,
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
});

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  dateInput.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const timeDiff = selectedDate - now;

    if (timeDiff <= 0) {
      clearInterval(timerId);
      updateTimerUI(0);
      dateInput.disabled = false;
      startBtn.disabled = true;
      return;
    }

    updateTimerUI(timeDiff);
  }, 1000);
});

function updateTimerUI(ms) {
  const { days, hours, minutes, seconds } = convertMs(ms);

  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
