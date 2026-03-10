// glue: event listeners & orchestration

import * as dom from './dom.js';
import { loadPlans, savePlans } from './storage.js';
import { validateTimeInputs, hasOverlap, filterPlans } from './logic.js';
import { displayStoredPlans } from './ui.js';


dom.form.addEventListener('submit', (event) => {
    event.preventDefault();
    
    
    let dataValue = dom.dataInput.value;
    let planValue = dom.planInput.value.trim();
    
    const startTime = dom.startTimeInput.value;
    const endTime = dom.endTimeInput.value;

    if(!dataValue || !planValue) return;

    if(!validateTimeInputs(startTime, endTime)) {
        alert('Please provide valid start and end times.');
        return;
    }

    const plans = loadPlans();

    if (hasOverlap(plans, dataValue, startTime, endTime)) {
        alert('This time overlaps with another plan.');
        return;
    }


    if(!plans[dataValue]){
        plans[dataValue] = [];
    }
    plans[dataValue].push({
        // id: crypto.randomUUID(),
        id: Date.now(),
        value: planValue, 
        startTime, 
        endTime    
    })

    savePlans(plans);
    displayStoredPlans(plans);

    dom.dataInput.value = '';
    dom.planInput.value = '';

});


document.addEventListener('DOMContentLoaded', () => {
    displayStoredPlans(loadPlans());
})


dom.plansList.addEventListener('click', (event) => {

    const isDelete = event.target.classList.contains('delete-button');
    const isEdit = event.target.classList.contains('edit-button');

    if(!isDelete && !isEdit) return; //event delegation

    const li = event.target.closest('li');;
    const date = li.dataset.date;
    const id = parseInt(li.dataset.id);

    const plans = loadPlans();

    if(isDelete) {

        plans[date] = plans[date].filter(plan => plan.id !== id);

        if(plans[date].length === 0){
            delete plans[date];
        }
        
        savePlans(plans);
        displayStoredPlans(plans);
    }

    if(isEdit) {

        const planToEdit = plans[date].find(plan => plan.id === id);
        // console.log(planToEdit);


        dom.planInputPopup.value = planToEdit.value;
        dom.dateInputPopup.value = date;
        dom.startTimeInputPopup.value = planToEdit.startTime;
        dom.endTimeInputPopup.value = planToEdit.endTime;

        dom.savePopupButton.dataset.id = id;
        dom.savePopupButton.dataset.date = date;

        dom.formPopup.style.display = 'block';
    }
});


dom.editPlanForm.addEventListener('submit', (event) => {
    
    event.preventDefault();//prevent from reloading the page

    const startTimePopup = dom.startTimeInputPopup.value;
    const endTimePopup = dom.endTimeInputPopup.value;

    const datePopup = dom.dateInputPopup.value;
    const planPopup = dom.planInputPopup.value.trim();

    if(!datePopup || !planPopup) return;

    if(!validateTimeInputs(startTimePopup, endTimePopup)) {
        alert('Please provide valid start and end times.');
        return;
    } 

    const plans = loadPlans();

    const originalId = parseInt(dom.savePopupButton.dataset.id);
    const originalDate = dom.savePopupButton.dataset.date;

    if (hasOverlap(plans, datePopup, startTimePopup, endTimePopup, originalId)) {
        alert('This time overlaps with another plan.');
        return;
    }

    plans[originalDate] = plans[originalDate].filter(plan => plan.id !== originalId);//deleting the original plan if the date has changed
    
    if(plans[originalDate].length === 0){
        delete plans[originalDate];//deleting the date if no plans left
    }

    plans[datePopup] = plans[datePopup] || [];

    plans[datePopup].push({ //adding the edited plan with the same id
        id: originalId,
        value: planPopup,
        startTime: startTimePopup,
        endTime: endTimePopup
    });

    savePlans(plans);
    displayStoredPlans(plans);

    dom.formPopup.style.display = 'none';

});


dom.searchInput.addEventListener('input', (event) => {
    
    const query = event.target.value.trim();
    const plans = loadPlans();
    
    if(query === ''){
        displayStoredPlans(plans);
    } else {
        const filteredPlans = filterPlans(plans, query);
        displayStoredPlans(filteredPlans);
    }

});


dom.cancelPopupButton.addEventListener('click', () => {
    dom.formPopup.style.display = 'none';
});


function geatherDataFromFields() {
    const dateValue = dom.dataInput.value;
    const planValue = dom.planInput.value.trim();
    const startTime = dom.startTimeInput.value;
    const endTime = dom.endTimeInput.value;

    return {dateValue,  startTime, endTime, planValue, usrID : 1};
}

async function fetchData() {
    const response = await fetch("/api/plans", {
        method: "POST",
        headers: { "Content-Type" : "application/json"},
        body: JSON.stringify(geatherDataFromFields())

    });

    const result = await response.json();
    console.log(result);
 }

dom.addButton.addEventListener('click', fetchData);

console.log(localStorage);
