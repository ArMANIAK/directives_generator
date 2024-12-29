const XLSX = require("xlsx");
const {
    TITLES_VAR,
    TITLES_SHEET,
    DEPARTMENTS_VAR,
    DEPARTMENTS_SHEET,
    SERVANTS_VAR,
    SERVANTS_SHEET
} = require("../dictionaries/constants")

const servantsHeaderMapToRaw = {
    "id": "Ідентифікатор",
    "first_name_nominative": "Ім'я та по батькові в називному відмінку",
    "first_name_genitive": "Ім'я та по батькові в родовому відмінку",
    "first_name_dative": "Ім'я та по батькові в давальному відмінку",
    "first_name_accusative": "Ім'я та по батькові в знахідному відмінку",
    "first_name_short": "Ініціали",
    "last_name_nominative": "Прізвище в називному відмінку",
    "last_name_genitive": "Прізвище в родовому відмінку",
    "last_name_dative": "Прізвище в давальному відмінку",
    "last_name_accusative": "Прізвище в знахідному відмінку",
    "rank": "Військове звання (ідентифікатор з аркуша \"Військові звання\")",
    "speciality": "Спеціалізація",
    "gender": "Гендер",
    "primary_title": "Основна посада (ідентифікатор з аркуша \"Посади\")",
    "primary_department": "Основний підрозділ (ідентифікатор з аркуша \"Підрозділи\")",
    "secondary_title": "Вторинна посада (через тире до основної посади, ідентифікатор з аркуша \"Посади\")",
    "secondary_department": "Вторинний підрозділ (ідентифікатор з аркуша \"Підрозділи\")",
    "supplied_by": "На котловому забезпеченні при...",
    "retired": "Звільнений/переведений"
}

const servantsRawMapToHeader = {
    "Ідентифікатор": "id",
    "Ім'я та по батькові в називному відмінку": "first_name_nominative",
    "Ім'я та по батькові в родовому відмінку": "first_name_genitive",
    "Ім'я та по батькові в давальному відмінку": "first_name_dative",
    "Ім'я та по батькові в знахідному відмінку": "first_name_accusative",
    "Ініціали": "first_name_short",
    "Прізвище в називному відмінку": "last_name_nominative",
    "Прізвище в родовому відмінку": "last_name_genitive",
    "Прізвище в давальному відмінку": "last_name_dative",
    "Прізвище в знахідному відмінку": "last_name_accusative",
    "Військове звання (ідентифікатор з аркуша \"Військові звання\")": "rank",
    "Спеціалізація": "speciality",
    "Гендер": "gender",
    "Основна посада (ідентифікатор з аркуша \"Посади\")": "primary_title",
    "Основний підрозділ (ідентифікатор з аркуша \"Підрозділи\")": "primary_department",
    "Вторинна посада (через тире до основної посади, ідентифікатор з аркуша \"Посади\")": "secondary_title",
    "Вторинний підрозділ (ідентифікатор з аркуша \"Підрозділи\")": "secondary_department",
    "На котловому забезпеченні при...": "supplied_by",
    "Звільнений/переведений": "retired"

}

const departmentsRawMapToHeaders = {
    "Ідентифікатор": "id",
    "Назва підрозділу в називному відмінку": "name_nominative",
    "Назва підрозділу в родовому відмінку": "name_genitive",
    "Ідентифікатор керівного підрозділу": "parent_id"
}

const departmentsHeadersMapToRaw = {
    "id": "Ідентифікатор",
    "name_nominative": "Назва підрозділу в називному відмінку",
    "name_genitive": "Назва підрозділу в родовому відмінку",
    "parent_id": "Ідентифікатор керівного підрозділу"
}

const titlesRawMapToHeaders = {
    "Ідентифікатор": "id",
    "Назва посади в називному відмінку": "name_nominative",
    "Назва посади в давальному відмінку": "name_dative",
    "Назва посади в знахідному відмінку": "name_accusative"
}

const titlesHeadersMapToRaw = {
    "id": "Ідентифікатор",
    "name_nominative": "Назва посади в називному відмінку",
    "name_dative": "Назва посади в давальному відмінку",
    "name_accusative": "Назва посади в знахідному відмінку"
}

const tempBookRawMapToHeaders = {
    "Номер документу (посвідчення, довідка, направлення, тощо)": "certificate",
    "Дата реєстрації документа": "certificate_issue_date",
    "Військове звання (для наочності)": "rank",
    "Прізвище та ініціали (для наочності)": "servant_name",
    "Ідентифікатор військовослужбовця (відповідно до ідентифікатора в словнику)": "servant_id",
    "Тип відсутності": "absence_type",
    "Місце тимчасового перебування": "destination",
    "Дата вибуття": "date_start",
    "Дата наказу, яким вибув": "depart_order_date",
    "Номер наказу, яким вибув": "depart_order_no",
    "Термін відсутності": "day_count",
    "Очікувана дата повернення": "planned_date_end",
    "Реальна дата повернення": "fact_date_end",
    "Дата наказу, яким прибув": "arrive_order_date",
    "Номер наказу, яким прибув": "arrive_order_no",
    "З продовольчим атестатом (так/ні)": "with_ration_certificate"
}

const tempBookHeadersMapToRaw = {
    "certificate": "Номер документу (посвідчення, довідка, направлення, тощо)",
    "certificate_issue_date": "Дата реєстрації документа",
    "rank": "Військове звання (для наочності)",
    "servant_name": "Прізвище та ініціали (для наочності)",
    "servant_id": "Ідентифікатор військовослужбовця (відповідно до ідентифікатора в словнику)",
    "absence_type": "Тип відсутності",
    "destination": "Місце тимчасового перебування",
    "date_start": "Дата вибуття",
    "depart_order_date": "Дата наказу, яким вибув",
    "depart_order_no": "Номер наказу, яким вибув",
    "day_count": "Термін відсутності",
    "planned_date_end": "Очікувана дата повернення",
    "fact_date_end": "Реальна дата повернення",
    "arrive_order_date": "Дата наказу, яким прибув",
    "arrive_order_no": "Номер наказу, яким прибув",
    "with_ration_certificate": "З продовольчим атестатом (так/ні)"
}

const convertHeaders = (data, headerDictionary) => {
    const [ headers, ...rows ] = data;
    const convertedHeaders = headers.map(header => headerDictionary[header] || header);
    return rows.map(row => Object.fromEntries(convertedHeaders.map((key, i) => [key, row[i]])))
}

const loadDictionaries = dictionaryFilePath => {
    const workbook = XLSX.readFile(dictionaryFilePath);
    let titles = XLSX.utils.sheet_to_json(workbook.Sheets[TITLES_SHEET], { header: 1, defval: "" });
    let departments = XLSX.utils.sheet_to_json(workbook.Sheets["Підрозділи"], { header: 1, defval: "" });
    let servants = XLSX.utils.sheet_to_json(workbook.Sheets["Персонал"], { header: 1, defval: "" });
    return {
        titles: convertHeaders(titles, titlesRawMapToHeaders),
        departments: convertHeaders(departments, departmentsRawMapToHeaders),
        servants: convertHeaders(servants, servantsRawMapToHeader) };
}

const loadTemporalBook = temporalBookFilePath => {
    console.log("LOAD TEMP BOOK")
    const workbook = XLSX.readFile(temporalBookFilePath);
    let tempBook = XLSX.utils.sheet_to_json(workbook.Sheets["temp_book"], { header: 1 })
    return convertHeaders(tempBook, tempBookRawMapToHeaders);
}

const saveTemporalBook = (temporalBookFilePath, data) => {
    console.log("SAVE TEMP BOOK", data);
    const workbook = XLSX.readFile(temporalBookFilePath);
    const convertedData = data.map(row =>
        Object.fromEntries(Object.entries(row).map(key => [tempBookHeadersMapToRaw[key[0]], key[1]])));
    workbook.Sheets["temp_book"] = XLSX.utils.json_to_sheet(convertedData);
    XLSX.writeFile(workbook, temporalBookFilePath);
}

const saveDictionary = (dictionaryFilePath, dictionaryType, data) => {
    console.log("SAVE DICTIONARY", dictionaryType, data);
    let sheet, converter;
    switch (dictionaryType) {
        case TITLES_VAR: {
            sheet = TITLES_SHEET;
            converter = titlesHeadersMapToRaw;
            break;
        }
        case DEPARTMENTS_VAR: {
            sheet = DEPARTMENTS_SHEET;
            converter = departmentsHeadersMapToRaw;
            break;
        }
        case SERVANTS_VAR: {
            sheet = SERVANTS_SHEET;
            converter = servantsHeaderMapToRaw;
            break;
        }
    }
    const workbook = XLSX.readFile(dictionaryFilePath);
    const convertedData = data.map(row =>
        Object.fromEntries(Object.entries(row).map(key => [converter[key[0]], key[1]])));
    workbook.Sheets[sheet] = XLSX.utils.json_to_sheet(convertedData);
    XLSX.writeFile(workbook, dictionaryFilePath);
}

module.exports = { loadDictionaries, loadTemporalBook, saveTemporalBook, saveDictionary };