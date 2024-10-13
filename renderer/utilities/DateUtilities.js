import {isEmployee} from "../services/ServantsService";

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

const dayEnding = (daysQuantity, isEmployee = false) => {
    let twoDigit = daysQuantity % 100;
    if (twoDigit < 20) {
        switch (twoDigit) {
            case 1:
                return isEmployee ? "календарний день" : "добу";
            case 2:
            case 3:
            case 4:
                return isEmployee ? "календарних дні" : "доби";
            default:
                return isEmployee ? "календарних днів" : "діб";
        }
    } else {
        switch (twoDigit % 10) {
            case 1:
                return isEmployee ? "календарних дні" : "добу";
            case 2:
            case 3:
            case 4:
                return isEmployee ? "календарний день" : "доби";
            default:
                return isEmployee ? "календарних днів" : "діб";
        }
    }
}

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

export function DateMath(dateString, modifier, mode = 'add') {
    switch (mode) {
        case 'add' :
            return new Date((new Date(dateString)).getTime() + modifier * 24 * 60 * 60 * 1000);
        case 'subtract':
            return new Date((new Date(dateString)).getTime() - modifier * 24 * 60 * 60 * 1000);
        default:
            return new Date(dateString)
    }
}

export function DateStartToEndFormat(startDate, endDate = undefined, isEmployee = false) {
    let startDateObject = new Date(startDate);
    if (!endDate) return `з ${FormatDate(startDateObject, false)}`
    let endDateObject = new Date(endDate);
    let difference = Math.ceil((endDateObject - startDateObject) / 1000 / 60 / 60 / 24) + 1
    if (difference < 10) difference = "0" + difference;
    let till = FormatDate(endDateObject, false);
    if (difference === "01") return `на ${difference} ${dayEnding(difference, isEmployee)} ${till}`;
    let from = startDateObject.getDate() < 10 ? "0" + startDateObject.getDate() : startDateObject.getDate();
    if (startDateObject.getFullYear() !== endDateObject.getFullYear())
        from = FormatDate(startDateObject, false);
    else if (startDateObject.getMonth() !== endDateObject.getMonth())
        from += ` ${monthsList[startDateObject.getMonth()]}`
    return `на ${difference} ${dayEnding(difference, isEmployee)} з ${from} по ${till}`;
}