const XLSX = require("xlsx");

const loadDictionaries = dictionaryFilePath => {
    const workbook = XLSX.readFile(dictionaryFilePath);
    let titles = XLSX.utils.sheet_to_json(workbook.Sheets["Посади"]);
    let departments = XLSX.utils.sheet_to_json(workbook.Sheets["Підрозділи"]);
    let servants = XLSX.utils.sheet_to_json(workbook.Sheets["Військовослужбовці"]);
    return { titles, departments, servants };
}

module.exports = { loadDictionaries };