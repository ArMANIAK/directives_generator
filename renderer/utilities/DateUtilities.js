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

export function formatDate(date, isShort = true) {
    let dateObj = date instanceof Date ? date : new Date(date)
    let day = dateObj.getDate();
    if (day < 10) day = '0' + day;
    let month = dateObj.getMonth();
    if (isShort && ++month < 10) month = '0' + month;
    let year = dateObj.getFullYear();
    if (!isShort) return `${day} ${monthsList[month]} ${year} року`;
    return `${day}.${month}.${year}`;

}

export function datePickerToDateString(date) {
    if (!date) return date;
    const [ day, month, year ] = date.split(".");
    return `${year}-${month}-${day}`;
}

export function dateToDatepickerString(date) {
    let dateObj = date instanceof Date ? date : new Date(date)
    let day = dateObj.getDate();
    if (day < 10) day = '0' + day;
    let month = dateObj.getMonth() + 1;
    if (month < 10) month = '0' + month;
    let year = dateObj.getFullYear();
    return `${year}-${month}-${day}`;
}

export function dateMath(dateString, modifier, mode = 'add') {
    switch (mode) {
        case 'add' :
            return new Date((new Date(dateString)).getTime() + parseInt(modifier) * 24 * 60 * 60 * 1000);
        case 'subtract':
            return new Date((new Date(dateString)).getTime() - parseInt(modifier) * 24 * 60 * 60 * 1000);
        default:
            return new Date(dateString)
    }
}

export function getDateDifference(startDateObj, endDateObj) {
    return Math.ceil((endDateObj - startDateObj) / 1000 / 60 / 60 / 24) + 1
}

export function dateStartToEndFormat(startDate, endDate = undefined, isEmployee = false) {
    let startDateObject = new Date(startDate);
    if (!endDate) return `з ${formatDate(startDateObject, false)}`
    let endDateObject = new Date(endDate);
    let difference = getDateDifference(startDateObject, endDateObject);
    if (difference < 10) difference = "0" + difference;
    let till = formatDate(endDateObject, false);
    if (difference === "01") return `на ${difference} ${dayEnding(difference, isEmployee)} ${till}`;
    let from = startDateObject.getDate() < 10 ? "0" + startDateObject.getDate() : startDateObject.getDate();
    if (startDateObject.getFullYear() !== endDateObject.getFullYear())
        from = formatDate(startDateObject, false);
    else if (startDateObject.getMonth() !== endDateObject.getMonth())
        from += ` ${monthsList[startDateObject.getMonth()]}`
    return `на ${difference} ${dayEnding(difference, isEmployee)} з ${from} по ${till}`;
}

export function dateStringCompare(date_1, date_2) {
    const [ day1, month1, year1 ] = date_1.split("-");
    const [ day2, month2, year2 ] = date_2.split("-");
    if (year1 < year2) return -1;
    if (year1 > year2) return 1;
    if (month1 < month2) return -1;
    if (month1 > month2) return 1;
    if (day1 < day2) return -1;
    if (day1 > day2) return 1;
    return 0;
}
