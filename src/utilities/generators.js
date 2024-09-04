const servants = require("../dictionaries/servants.json");
const departments = require("../dictionaries/departments.json");
const titles = require("../dictionaries/titles.json");
const ranks = require("../dictionaries/ranks.json");
const certificates = require("../dictionaries/certificates.json");
import { FormatDate } from "@/utilities/DateFormatters";

export function GenerateName(id, servantCase = "accusative", form = "short") {
    const servant = servants.find(el => el.id === id);
    const rank = GenerateRankName(servant.rank, servantCase);
    return rank + ' ' + servant['last_name_' + servantCase] + ' ' + (form === 'short' ? servant.first_name_short : servant['first_name_' + servantCase])
}

export function GenerateRankName(id, rankCase = "accusative") {
    const rank = ranks.find(el => el.id === id);
    return rank["name_" + rankCase];
}

export function GenerateFullTitle(id, servantCase = "accusative", form = "short") {
    const servant = servants.find(el => el.id === id);
    const fullName = GenerateName(id, servantCase, form);
    const title = titles.find(el => el.id === servant.title);
    const titleName = title["name_" + servantCase];
    const departmentName = GenerateFullDepartment(servant.department);
    return `${fullName}, ${titleName} ${departmentName}`;
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

function GenerateAddToRation(servant_id) {
    const tomorrow = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    const formattedTomorrow = FormatDate(tomorrow, false)
    return `Зарахувати ${GenerateName(servant_id)} на котлове забезпечення військової частини А0000 за каталогом продуктів - зі сніданку ${formattedTomorrow}.`
}

function GenerateJustification(record) {
    let justification = '';
    justification += `Підстава: ${certificates[record.absence_type]} ${record.certificate} від ${FormatDate(record.certificate_issue_date)}`;
    if (record.with_ration_certificate) justification += `, продовольчий атестат від ${FormatDate(record.ration_certificate_issue_date)} № ${record.ration_certificate}`;
    justification += '.\n\n';
    return justification;
}

export function GenerateDirective(pull) {
    const groupedPull = pull.reduce((acc, el) => {
        if (!acc[el.activity]) {
            acc[el.activity] = {}
        }
        if (!acc[el.activity][el.absence_type]) {
            acc[el.activity][el.absence_type] = [];
        }
        acc[el.activity][el.absence_type] = [...acc[el.activity][el.absence_type], el];
        return acc;
    }, {})
    console.log(groupedPull)
    // return groupedPull
    let generalCount = 1;
    let directive = '';
    let arrive = groupedPull['arrive'];
    if (arrive) {
        let middleCount = 1;
        if (arrive['mission'] && arrive['mission'].length > 0) {
            let mission = arrive['mission'];
            for (let i = 0, n = mission.length; i < n; i++) {
                directive += `${generalCount}.${middleCount}.${i + 1}. З ${mission[i].destination} ${FormatDate(mission[i].date_start, false)}:\n\n`;
                directive += `${GenerateFullTitle(mission[i].servant)}.\n\n`;
                directive += `${GenerateAddToRation(mission[i].servant)}\n\n`;
                directive += `${GenerateJustification(mission[i])}\n\n`;
            }
            middleCount++;
        }
        if (arrive['medical_care'] && arrive['medical_care'].length > 0) {
            let medical_care = arrive['medical_care'];
            for (let i = 0, n = medical_care.length; i < n; i++) {
                directive += `${generalCount}.${middleCount}. З ${medical_care[i].destination} ${FormatDate(medical_care[i].date_start, false)}:\n\n`;
                directive += `${GenerateFullTitle(medical_care[i].servant)}.\n\n`;
                directive += `${GenerateAddToRation(medical_care[i].servant)}\n\n`;
                directive += `${GenerateJustification(medical_care[i])}\n\n`;
                middleCount++;
            }
        }
        if (arrive['medical_board'] && arrive['medical_board'].length > 0) {
            let medical_board = arrive['medical_board'];
            for (let i = 0, n = medical_board.length; i < n; i++) {
                directive += `${generalCount}.${middleCount}. З ${medical_board[i].destination} ${FormatDate(medical_board[i].date_start, false)}:\n\n`;
                directive += `${GenerateFullTitle(medical_board[i].servant)}.\n\n`;
                directive += `${GenerateAddToRation(medical_board[i].servant)}\n\n`;
                directive += `${GenerateJustification(medical_board[i])}\n\n`;
                middleCount++;
            }
        }
        if (arrive['vacation'] && arrive['vacation'].length > 0) {
            directive += `${generalCount}.${middleCount}. З щорічної основної відпустки:\n\n`;
            let vacation = arrive['vacation'];
            for (let i = 0, n = vacation.length; i < n; i++) {
                directive += `${FormatDate(vacation[i].date_start, false)}:\n\n`;
                let servant = GenerateFullTitle(vacation[i].servant);
                directive += `${generalCount}.${middleCount}.${i+1}. ${servant[0].toLocaleUpperCase() + servant.slice(1)}.\n\n`;
                directive += `${GenerateAddToRation(vacation[i].servant)}\n\n`;
                directive += `${GenerateJustification(vacation[i])}\n\n`;
            }
            middleCount++;
        }
        if (arrive['family_circumstances'] && arrive['family_circumstances'].length > 0) {
            let family_circumstances = arrive['family_circumstances'];
            directive += `${generalCount}.${middleCount}. З відпустки за сімейними обставинами:\n\n`;
            for (let i = 0, n = family_circumstances.length; i < n; i++) {
                directive += `${generalCount}.${middleCount}.${i+1}. ${FormatDate(family_circumstances[i].date_start, false)}:\n\n`;
                let servant = GenerateFullTitle(family_circumstances[i].servant);
                directive += `${generalCount}.${middleCount}.${i+1}. ${servant[0].toLocaleUpperCase() + servant.slice(1)}.\n\n`;
                directive += `${GenerateAddToRation(family_circumstances[i].servant)}\n\n`;
                directive += `${GenerateJustification(family_circumstances[i])}\n\n`;
            }
            middleCount++;
        }
        if (arrive['health_circumstances'] && arrive['health_circumstances'].length > 0) {
            let health_circumstances = arrive['health_circumstances'];
            directive += `${generalCount}.${middleCount}. З відпустки за станом здоров'я:\n\n`;
            for (let i = 0, n = health_circumstances.length; i < n; i++) {
                directive += `${generalCount}.${middleCount}.${i+1}. ${FormatDate(health_circumstances[i].date_start, false)}:\n\n`;
                let servant = GenerateFullTitle(health_circumstances[i].servant);
                directive += `${generalCount}.${middleCount}.${i+1}. ${servant[0].toLocaleUpperCase() + servant.slice(1)}.\n\n`;
                directive += `${GenerateAddToRation(health_circumstances[i].servant)}\n\n`;
                directive += `${GenerateJustification(health_circumstances[i])}\n\n`;
            }
            middleCount++;
        }
    }
    console.log(directive)
    return navigator.clipboard.writeText(directive)
}