exports.getDaysDiff = (date1, date2) =>{
    let timeDiff = Math.abs(date2.getTime() - date1.getTime());
    return Math.floor(timeDiff / (1000 * 3600 * 24));
}

exports.addMinutes = (date, minutes)  =>{
    return new Date(date.getTime() + minutes*60000);
}