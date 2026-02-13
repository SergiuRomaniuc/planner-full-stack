// localStorage logic

export function loadPlans(){
    return JSON.parse(localStorage.getItem('plans')) || {};
}

export function savePlans(plans){
    localStorage.setItem('plans', JSON.stringify(plans));
}
