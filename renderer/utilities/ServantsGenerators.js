import { getServantById, getRoles, getTitles, getDepartments } from "../services/ServantsService";
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

export function GenerateFullTitleByTitleIndex(index, titleCase = "accusative") {
    const title = getTitles().find(el => "" + el.title_index === "" + index)
    if (!title) return "";
    return GenerateFullTitle(title, titleCase)
}

export function GenerateFullTitle(title, titleCase = "accusative") {
    let fullTitle = "";
    const primaryRole = getRoles().find(el => el.id === title.primary_role);
    const primaryRoleName = primaryRole ? primaryRole["name_" + titleCase] : "";
    if (primaryRoleName) fullTitle += primaryRoleName;
    if (title.primary_department)
        fullTitle += " " + GenerateFullDepartment(title.primary_department, "genitive", !!title.secondary_role)
    if (title.secondary_role) {
        const secondaryTitle = getRoles().find(el => el.id === title.secondary_role);
        if (secondaryTitle)
            fullTitle += ` – ${secondaryTitle["name_" + titleCase]}`;
    }
    if (title.secondary_department) fullTitle += " " + GenerateFullDepartment(title.secondary_department)
    return fullTitle;

}

export function GenerateServantRankNameAndTitle(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return "";
    let fullText = GenerateRankAndName(id, servantCase, form);
    const title = getTitles().find(el => el.title_index === servant.title_index);
    if (!title) return fullText;
    const fullTitle = GenerateFullTitle(title, servantCase);
    if (fullTitle)
        fullText += `, ${fullTitle}`
    return fullText;
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