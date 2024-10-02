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
    const title = getTitles().find(el => el.id === servant.primary_title);
    const titleName = title["name_" + servantCase];
    const departmentName = GenerateFullDepartment(servant.primary_department);
    return `${fullName}, ${titleName} ${departmentName}`;
}

export function GenerateFullDepartment(id, departmentCase = 'genitive') {
    let departments = getDepartments();
    const department = departments.find(el => el.id === id);
    let departmentName = department['name_' + departmentCase];
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