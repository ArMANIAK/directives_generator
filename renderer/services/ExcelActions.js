const XLSX = require("xlsx");

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
    "gender": "Гендер",
    "primary_title": "Основна посада (ідентифікатор з аркуша \"Посади\")",
    "primary_department": "Основний підрозділ (ідентифікатор з аркуша \"Підрозділи\")",
    "secondary_title": "Вторинна посада (через тире до основної посади, ідентифікатор з аркуша \"Посади\")",
    "secondary_department": "Вторинний підрозділ (ідентифікатор з аркуша \"Підрозділи\")",
    "supplied_by": "На котловому забезпеченні при..."
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
    "Гендер": "gender",
    "Основна посада (ідентифікатор з аркуша \"Посади\")": "primary_title",
    "Основний підрозділ (ідентифікатор з аркуша \"Підрозділи\")": "primary_department",
    "Вторинна посада (через тире до основної посади, ідентифікатор з аркуша \"Посади\")": "secondary_title",
    "Вторинний підрозділ (ідентифікатор з аркуша \"Підрозділи\")": "secondary_department",
    "На котловому забезпеченні при...": "supplied_by"
}

const departmentsRawMapToHeaders = {
    "Ідентифікатор": "id",
    "Назва підрозділу в називному відмінку": "name_nominative",
    "Назва підрозділу в родовому відмінку": "name_genitive",
    "Ідентифікатор керівного підрозділу": "parent_id"
}

const titlesRawMapToHeaders = {
    "Ідентифікатор": "id",
    "Назва посади в називному відмінку": "name_nominative",
    "Назва посади в давальному відмінку": "name_dative",
    "Назва посади в знахідному відмінку": "name_accusative"
}

const tempBookRawMapToHeaders = {
    "Тип відсутності": "absence_type",
    "Ідентифікатор військовослужбовця (відповідно до ідентифікатора в словнику)": "servant_id",
    "Військове звання (для наочності)": "rank",
    "Прізвище та ініціали (для наочності)": "servant_name",
    "Місце тимчасового перебування": "destination",
    "Дата вибуття": "date_start",
    "Очікувана дата повернення": "planned_date_end",
    "Номер документу (посвідчення, довідка, направлення, тощо)": "certificate",
    "Дата реєстрації документа": "certificate_issue_date",
    "З продовольчим атестатом (так/ні)": "with_ration_certificate",
    "Номер наказу, яким вибув": "depart_order_no",
    "Номер наказу, яким прибув": "arrive_order_no",
    "Реальна дата повернення": "fact_date_end",
}

const tempBookHeadersMapToRaw = {
    "absence_type": "Тип відсутності",
    "servant_id": "Ідентифікатор військовослужбовця (відповідно до ідентифікатора в словнику)",
    "rank": "Військове звання (для наочності)",
    "servant_name": "Прізвище та ініціали (для наочності)",
    "destination": "Місце тимчасового перебування",
    "date_start": "Дата вибуття",
    "planned_date_end": "Очікувана дата повернення",
    "certificate": "Номер документу (посвідчення, довідка, направлення, тощо)",
    "certificate_issue_date": "Дата реєстрації документа",
    "with_ration_certificate": "З продовольчим атестатом (так/ні)",
    "depart_order_no": "Номер наказу, яким вибув",
    "arrive_order_no": "Номер наказу, яким прибув",
    "fact_date_end": "Реальна дата повернення"
}

const convertHeaders = (data, headerDictionary) => {
    const [ headers, ...rows ] = data;
    const convertedHeaders = headers.map(header => headerDictionary[header] || header);
    return rows.map(row => Object.fromEntries(convertedHeaders.map((key, i) => [key, row[i]])))
}

const loadDictionaries = dictionaryFilePath => {
    const workbook = XLSX.readFile(dictionaryFilePath);
    let titles = XLSX.utils.sheet_to_json(workbook.Sheets["Посади"], { header: 1, defval: "" });
    let departments = XLSX.utils.sheet_to_json(workbook.Sheets["Підрозділи"], { header: 1, defval: "" });
    let servants = XLSX.utils.sheet_to_json(workbook.Sheets["Військовослужбовці"], { header: 1, defval: "" });
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
    console.log("SAVE TEMP BOOK", data)
    const workbook = XLSX.readFile(temporalBookFilePath);
    const convertedData = data.map(row =>
        Object.fromEntries(Object.entries(row).map(key => [tempBookHeadersMapToRaw[key[0]], key[1]])))
    workbook.Sheets["temp_book"] = XLSX.utils.json_to_sheet(convertedData)
    XLSX.writeFile(workbook, temporalBookFilePath);
}

module.exports = { loadDictionaries, loadTemporalBook, saveTemporalBook };