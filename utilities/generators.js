const servants = require("../dictionaries/servants.json");
const departments = require("../dictionaries/departments.json");
const titles = require("../dictionaries/titles.json");
const ranks = require("../dictionaries/ranks.json");

export function GenerateName(id, servantCase = "accusative", form = "short") {
    const servant = servants.find(el => el.id === id);
    return servant['last_name_' + servantCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + servantCase])
}

export function GenerateRankName(id, rankCase = "accusative") {
    const rank = ranks.find(el => el.id === id);
    return rank["name_" + rankCase];
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    console.dir({ servants, titles, ranks, departments })
    const servant = servants.find(el => el.id === id);
    const fullName = GenerateName(id, servantCase, form);
    const title = titles.find(el => el.id === servant.title);
    const titleName = title["name_" + servantCase];
    const rankName = GenerateRankName(servant.rank, servantCase);
    const departmentName = GenerateFullDepartment(servant.department);
    return `${rankName} ${fullName}, ${titleName} ${departmentName}`;
}

export function GenerateFullDepartment(id, departmentCase = 'genitive') {
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