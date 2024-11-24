const XLSX = require("xlsx");

const loadDictionaries = dictionaryFilePath => {
    const workbook = XLSX.readFile(dictionaryFilePath);
    let titles = XLSX.utils.sheet_to_json(workbook.Sheets["Посади"]);
    let departments = XLSX.utils.sheet_to_json(workbook.Sheets["Підрозділи"]);
    let servants = XLSX.utils.sheet_to_json(workbook.Sheets["Військовослужбовці"]);
    return { titles, departments, servants };
}

const loadTemporalBook = temporalBookFilePath => {
    console.log("LOAD TEMP BOOK")
    const workbook = XLSX.readFile(temporalBookFilePath);
    return XLSX.utils.sheet_to_json(workbook.Sheets["temp_book"]);
}

const saveTemporalBook = (temporalBookFilePath, data) => {
    console.log("SAVE TEMP BOOK")
    const workbook = XLSX.readFile(temporalBookFilePath);
    workbook.Sheets["temp_book"] = XLSX.utils.json_to_sheet(data/*, options*/)
    XLSX.writeFile(workbook, temporalBookFilePath);
}

module.exports = { loadDictionaries, loadTemporalBook, saveTemporalBook };