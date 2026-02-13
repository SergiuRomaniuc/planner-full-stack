
import { loadPlans } from './storage.js';

const calendarContainer = document.querySelector('.calendar-section');
const monthYearDisplay = document.getElementById('month-year');
const prevMonthButton = document.getElementById('prev-month');
const nextMonthButton = document.getElementById('next-month');
const plansList = document.querySelector('.plans-list');

let now = new Date();

function getDaysInMonth(date = new Date()) {
    
    const year = date.getFullYear();
    const month = date.getMonth(); // 0-indexed (0 = January, 1 = February
    // console.log(new Date(year, month + 1, 0).getDate());
    return new Date(year, month + 1, 0).getDate();

}


function generateCalendar(date = new Date()) {
    calendarContainer.innerHTML = ''; // Clear previous calendar
    const days = getDaysInMonth(date);
    for(let day = 1; day <= days; day++) {
        const dayElement = `
        <div class="calendar-container ${(day === new Date().getDate() && date.getFullYear() === new Date().getFullYear() && date.getMonth() === new Date().getMonth()) ? 'todays-container' : ''}" data-day=${day.toString().padStart(2, '0')}>
            <div class="date-box">
                <p>${day}</p>
                <list class="plans-list"></list>
            </div>
        </div>
        `;
        calendarContainer.innerHTML += dayElement;
    }
}


function findValuesForMonth(date){
    const plans = loadPlans();
    const keys = Object.keys(plans);
    
    const plansForMonth = {};

    for(let key of keys){
        if(key.includes(date)) plansForMonth[key] = plans[key];
    }
    return plansForMonth;
}    


function getPlansForDate(date) {
    const dateString = date.toISOString().slice(0,7);
    // console.log(findValuesForMonth(dateString));
    return findValuesForMonth(dateString);
}


function generatePlansForMonth(date = new Date()) {
    const plans = loadPlans();

    const plansForMonth = getPlansForDate(date);

    // plansList.innerHTML = '';

    Object.keys(plansForMonth).forEach(date => {
        console.log(date.slice(8,10));
        const plansListElement = document.querySelector(`[data-day="${date.slice(8,10)}"] .plans-list`);

        if(plansListElement){
            plansForMonth[date].forEach(plan => {
                const li = document.createElement('li');
                li.innerText = plan.value;
                plansListElement.appendChild(li);
            })
        }
    });

}


function updateMonth(date=new Date()) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[date.getMonth()];
    const year = date.getFullYear();
    monthYearDisplay.textContent = `${monthName} ${year}`;
}


document.addEventListener('DOMContentLoaded', () => {
    updateMonth();
    generateCalendar();
    generatePlansForMonth();
});

nextMonthButton.addEventListener('click', () => {
    now = new Date(now.setMonth(now.getMonth() + 1));
    updateMonth(now);
    generateCalendar(now);
    generatePlansForMonth(now);
});

prevMonthButton.addEventListener('click', () => {
    now = new Date(now.setMonth(now.getMonth() - 1));
    updateMonth(now);
    generateCalendar(now);
    generatePlansForMonth(now);
});


