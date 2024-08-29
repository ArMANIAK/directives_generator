const servants = require("../dictionaries/servants.json");
const departments = require("../dictionaries/departments.json");
const titles = require("../dictionaries/titles.json");

export function GenerateName(id, servantCase = "accusative", form = "short") {
    const servant = servants.find(el => el.id === id);
    return servant['last_name_' + servantCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + servantCase])
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    const servant = servants.find(el => el.id === id);
    const fullName = GenerateName(id, servantCase, form);
    const title = titles.find(el => servant.title === servant.title);
    const titleName = title["title_" + servantCase]
    const departmentName = GenerateFullDepartment(servant.department);
    return `${servant['rank_' + servantCase]} ${fullName}, ${titleName} ${departmentName}`;
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