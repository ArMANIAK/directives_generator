import { getServantById, getTitles, getDepartments } from "../services/ServantsService";
const ranks = require("../dictionaries/ranks.json");


export function GenerateRankAndName(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return ""
    return GenerateRankName(servant.rank, servantCase) + " " + GenerateName(id, servantCase, form)
}

export function GenerateRankName(id, rankCase = "accusative") {
    const rank = ranks.find(el => el.id === id);
    return rank["name_" + rankCase];
}

export function GenerateRankNameByServantId(id, rankCase = "accusative") {
    const servant = getServantById(id);
    if (!servant) return ""
    return GenerateRankName(servant.rank, rankCase);
}

export function GenerateName(id, nameCase = "accusative", form = "short") {
    const servant = getServantById(id);
    return servant['last_name_' + nameCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + nameCase]);
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return "";
    const fullName = GenerateRankAndName(id, servantCase, form);
    const primaryTitle = getTitles().find(el => el.id === servant.primary_title);
    const primaryTitleName = primaryTitle["name_" + servantCase];
    let fullTitle = `${fullName}, ${primaryTitleName}`;
    if (servant.primary_department) fullTitle += " " + GenerateFullDepartment(servant.primary_department, "genitive", !!servant.secondary_title)
    if (servant.secondary_title) {
        const secondaryTitle = getTitles().find(el => el.id === servant.secondary_title);
        fullTitle += ` – ${secondaryTitle["name_" + servantCase]}`;
    }
    if (servant.secondary_department) fullTitle += " " + GenerateFullDepartment(servant.secondary_department)
    return fullTitle;
}

export function GenerateFullDepartment(id, departmentCase = 'genitive', firstLevel = false) {
    let departments = getDepartments();
    const department = departments.find(el => parseInt(el.id) === parseInt(id));
    let departmentName = department['name_' + departmentCase];
    if (firstLevel) return departmentName;
    let parentId = department.parent_id;
    let parent = null;
    while(parentId) {
        parent = departments.find(el => el.id === parentId);
        departmentName += ' ' + parent.name_genitive;
        parentId = parent.parent_id;
    }
    return departmentName;
}

export function GetGeneralDepartmentName(id) {
    let departments = getDepartments();
    const department = departments.find(el => el.id === id);
    let departmentName = department.name_nominative;
    let parentId = department.parent_id;
    let parent = null;
    while(parentId) {
        parent = departments.find(el => el.id === parentId);
        departmentName = ' ' + parent.name_nominative;
        parentId = parent.parent_id;
    }
    return departmentName;
}