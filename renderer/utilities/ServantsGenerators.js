import { getServantById, getTitles, getDepartments } from "../services/ServantsService";
const ranks = require("../dictionaries/ranks.json");


export function GenerateRankAndName(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return ""
    return GenerateRankName(servant.rank, servant.speciality, servantCase) + " " + GenerateName(id, servantCase, form)
}

export function GenerateRankName(id, speciality = "", rankCase = "accusative") {
    const rank = ranks.find(el => el.id === id);
    let result = !!rank ? rank["name_" + rankCase] : "";
    if (speciality) result += ` ${speciality}`;
    return result;
}

export function GenerateRankNameByServantId(id, rankCase = "accusative") {
    const servant = getServantById(id);
    if (!servant) return ""
    return GenerateRankName(servant.rank, servant.speciality, rankCase);
}

export function GetTitleIndex(servant_id) {
    const servant = getServantById(servant_id);
    if (!servant) return "";
    return servant.title_index;
}

export function GenerateName(id, nameCase = "accusative", form = "short") {
    const servant = getServantById(id);
    return servant['last_name_' + nameCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + nameCase]);
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return "";
    let fullTitle = GenerateRankAndName(id, servantCase, form);
    const primaryTitle = getTitles().find(el => el.id === servant.primary_title);
    const primaryTitleName = primaryTitle ? primaryTitle["name_" + servantCase] : "";
    if (primaryTitleName) fullTitle += `, ${primaryTitleName}`;
    if (servant.primary_department)
        fullTitle += " " + GenerateFullDepartment(servant.primary_department, "genitive", !!servant.secondary_title)
    if (servant.secondary_title) {
        const secondaryTitle = getTitles().find(el => el.id === servant.secondary_title);
        if (secondaryTitle)
            fullTitle += ` – ${secondaryTitle["name_" + servantCase]}`;
    }
    if (servant.secondary_department) fullTitle += " " + GenerateFullDepartment(servant.secondary_department)
    return fullTitle;
}

export function GenerateFullDepartment(id, departmentCase = 'genitive', firstLevel = false) {
    let departments = getDepartments();
    const department = departments.find(el => parseInt(el.id) === parseInt(id));
    if (!department) return "";
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
    if (!department) return "";
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