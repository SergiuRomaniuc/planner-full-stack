// localStorage logic

export function loadPlans(){
    console.log('Loaded plans:' + localStorage.getItem('plans') || {})
    return JSON.parse(localStorage.getItem('plans')) || {};
}

export function savePlans(plans){
    console.log('Saving plans:' + plans)
    localStorage.setItem('plans', JSON.stringify(plans));
}
