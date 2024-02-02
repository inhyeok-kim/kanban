export function getToday(){
    const today = new Date();
    
    return today.getFullYear() + "-" + (today.getMonth()+1).toString().padStart(2,'0') + "-" + (today.getDate()).toString().padStart(2,'0');
}