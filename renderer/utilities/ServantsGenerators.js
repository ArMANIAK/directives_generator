import { getServantById, getTitles, getDepartments } from "../services/ServantsService";
const ranks = require("../dictionaries/ranks.json");


export function GenerateName(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return ""
    const rank = GenerateRankName(servant.rank, servantCase);
    return rank + ' ' + servant['last_name_' + servantCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + servantCase])
}

export function GenerateRankName(id, rankCase = "accusative") {
    const rank = ranks.find(el => el.id === id);
    return rank["name_" + rankCase];
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    const servant = getServantById(id);
    if (!servant) return "";
    const fullName = GenerateName(id, servantCase, form);
    const primaryTitle = getTitles().find(el => el.id === servant.primary_title);
    const primaryTitleName = primaryTitle["name_" + servantCase];
    let fullTitle = `${fullName}, ${primaryTitleName}`;
    if (servant.secondary_title) {
        fullTitle += ` ${GenerateFullDepartment(servant.primary_department, "genitive", true)} – `;
        const secondaryTitle = getTitles().find(el => el.id === servant.primary_title);
        fullTitle += `${secondaryTitle["name_" + servantCase]} ${GenerateFullDepartment(servant.secondary_department)}`;
    } else {
        fullTitle += ` ${GenerateFullDepartment(servant.primary_department)}`
    }
    return fullTitle;
}

export function GenerateFullDepartment(id, departmentCase = 'genitive', firstLevel = false) {
    let departments = getDepartments();
    const department = departments.find(el => el.id === id);
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