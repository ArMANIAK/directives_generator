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
    let month = date.getMonth() + 1;
    if (isShort && month < 10) month = '0' + month;
    let year = date.getFullYear();
    if (isShort) return `${day}.${month}.${year}`;
    return `${day} ${monthsList[month]} ${year} року`;
}

export function DateToDatepickerString(date) {
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let year = date.getFullYear();
    return `${year}-${month}-${day}`;
}