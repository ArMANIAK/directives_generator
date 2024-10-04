const monthsList = [
    'січня',
    'лютого',
    'березня',
    'квітня',
    'травня',
    'червня',
    'липня',
    'серпня',
    'вересня',
    'жовтня',
    'листопада',
    'грудня'
]

export function FormatDate(date, isShort = true) {
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    let month = date.getMonth();
    if (isShort && ++month < 10) month = '0' + month;
    let year = date.getFullYear();
    if (!isShort) return `${day} ${monthsList[month]} ${year} року`;
    return `${day}.${month}.${year}`;

}

export function DateToDatepickerString(date) {
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export function dateMath(dateString, modifier, mode = 'add') {
    switch (mode) {
        case 'add' :
            return new Date((new Date(dateString)).getTime() + modifier * 24 * 60 * 60 * 1000);
        case 'subtract':
            return new Date((new Date(dateString)).getTime() - modifier * 24 * 60 * 60 * 1000);
        default:
            return new Date(dateString)
    }
}