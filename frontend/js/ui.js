// DOM creation & rendering

import { plansList } from './dom.js';

export function displayStoredPlans(plans) {

    plansList.innerHTML = '';
    
    if(Object.keys(plans).length === 0){
        const p = document.createElement('p');
        p.textContent = 'No plans available.';
        plansList.appendChild(p);
        return;
    }

    Object.keys(plans)
        .sort()
        .forEach(date => {
            const h3 = document.createElement('h3');
            h3.textContent = `Date: ${date}`;
            plansList.appendChild(h3);

            plans[date].slice().sort((a,b) =>
            a.startTime.localeCompare(b.startTime)
            )
            .forEach(item => {
                const li = document.createElement('li');
                
                const textSpan = document.createElement('span');
                textSpan.classList.add('plan-text');
                textSpan.textContent = item.value;

                const timeSpan = document.createElement('span');
                timeSpan.classList.add('time-range');
                timeSpan.textContent = ` (${item.startTime} - ${item.endTime})`;

                li.appendChild(textSpan);
                li.appendChild(timeSpan);
                

                li.dataset.date = date;
                li.dataset.id = item.id;

                const buttonsContainer = document.createElement('div');
                buttonsContainer.classList.add('buttons-container');

                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('edit-button');

                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('delete-button');


                buttonsContainer.appendChild(editButton);
                buttonsContainer.appendChild(deleteButton);
                
                li.appendChild(buttonsContainer);
                plansList.appendChild(li);
            });
        });
}
