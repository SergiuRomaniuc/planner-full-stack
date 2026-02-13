// pure rules & calculations

export function validateTimeInputs(startTime, endTime){

    if(!startTime || !endTime) return false;

    if(startTime >= endTime) return false;
    
    return true;

}


export function hasOverlap(plans, date, startTime, endTime, ignoreId = null) {
    if (!plans[date]) return false;

    return plans[date].some(plan => {
        if (ignoreId && plan.id === ignoreId) return false;

        return !(endTime <= plan.startTime || startTime >= plan.endTime);
    });
}

export function filterPlans(plans, query){
    
    const filtered = {};
    const lowerQuery = query.toLowerCase();

    Object.keys(plans).forEach(date => {
        const matchedItems = plans[date].filter(item => 
            item.value.toLowerCase().includes(lowerQuery) ||
            item.startTime.includes(lowerQuery) ||
            item.endTime.includes(lowerQuery) ||
            date.includes(lowerQuery)
        );

        if(matchedItems.length > 0){
            filtered[date] = matchedItems;
        }
    });

    return filtered;
}
