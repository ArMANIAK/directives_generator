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

export function FormatDate(dateString, isShort = true) {
    let date = new Date(dateString)
    let day = date.getDate();
    if (day < 10) day = '0' + day;
    let month = date.getMonth();
    if (isShort && month < 10) month = '0' + month;
    let year = date.getFullYear();
    if (isShort) return `${day}.${month}.${year}`;
    return `${day} ${monthsList[month]} ${year} року`;
}