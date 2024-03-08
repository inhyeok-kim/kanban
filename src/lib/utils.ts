export function getToday(){
    const today = new Date();
    
    return today.getFullYear() + "-" + (today.getMonth()+1).toString().padStart(2,'0') + "-" + (today.getDate()).toString().padStart(2,'0');
}

export function getDateString(date : Date){
    return date.getFullYear() + "-" + (date.getMonth()+1).toString().padStart(2,'0') + "-" + (date.getDate()).toString().padStart(2,'0');
}

export function getWeekStartEnd(date : Date){
    const weekStart = new Date(date);
    const weekEnd = new Date(date);
    const day = date.getDay();
    weekStart.setDate(weekStart.getDate()-day);
    weekEnd.setDate(weekEnd.getDate()+6-day);
    return [getDateString(weekStart), getDateString(weekEnd)];
}