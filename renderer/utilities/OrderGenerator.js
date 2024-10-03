import { getServantById, isEmployee } from "../services/ServantsService";
const certificate = require("../dictionaries/certificates.json");

import { FormatDate, dateMath } from "./DateFormatters";
import { GenerateName, GenerateFullTitle } from "./ServantsGenerators";

function GenerateAddToRation(servant_id) {
    const servant = getServantById(servant_id);
    // If supplier is not set up or a servant is an employee no add to ration is added
    // Якщо для військовослужбовця не встановлено частину забезпечення котловим або він працівник ЗСУ, зарахування на котлове не відбувається
    if (!servant?.supplied_by || !servant?.rank) return "";
    const tomorrow = dateMath(new Date(), 1);
    const formattedTomorrow = FormatDate(tomorrow, false);
    return `Зарахувати ${GenerateName(servant_id)} на котлове забезпечення при ${servant.supplied_by} за каталогом продуктів - зі сніданку ${formattedTomorrow}.\n\n`
}

function GenerateJustification(records) {
    let justification = '';
    let certificates = '';
    let ration_certificates = '';
    for (let i = 0, n = records.length; i < n; i++) {
        let record = records[i];
        certificates += `${certificate[record.absence_type]} № ${record.certificate} від ${FormatDate(new Date(record.certificate_issue_date))}`;
        if (n !== 1 && i + 1 !== n) {
            certificates += ", ";
            if (record.with_ration_certificate)
                ration_certificates += ", ";
        }
    }
    justification += `Підстава: ${certificates}`;
    if (records[0].with_ration_certificate) {
        justification += `, продовольчий атестат від ${FormatDate(new Date(records[0].ration_certificate_issue_date))} № ${records[0].ration_certificate}`;
    }
    justification += '.\n\n';
    return justification;
}

export function GenerateOrder(pull, starting_index = 1) {
    const groupedPull = GroupPull(pull)
console.dir(groupedPull);

    let directive = '';
    let arrive = groupedPull['arrive'];
    let depart = groupedPull['depart'];
    let other = groupedPull['other_points'];
    if (arrive) directive += GenerateArriveClauses(arrive, starting_index++);return "";
    if (depart) directive += GenerateDepartureClauses(depart, starting_index++);
    if (other) directive += GenerateOtherClauses(other, starting_index++);

    return directive;
}

function GroupPull(pull) {
    return pull.reduce((acc, el) => {
        if (!acc[el.orderSection])
            acc[el.orderSection] = {}
        if (el.orderSection !== 'other_points' && !acc[el.orderSection][el.absence_type])
            acc[el.orderSection][el.absence_type] = {};

        switch (el.absence_type) {
            case "mission":
            case "medical_care":
            case "medical_board":
                if (!acc[el.orderSection][el.absence_type][el.destination])
                    acc[el.orderSection][el.absence_type][el.destination] = {};
                if (!acc[el.orderSection][el.absence_type][el.destination][el.date_start])
                    acc[el.orderSection][el.absence_type][el.destination][el.date_start] = [];
                acc[el.orderSection][el.absence_type][el.destination][el.date_start].push(el)
                break;
            case "sick_leave":
                if (isEmployee(el.servants)) {
                    if (!acc[el.orderSection]['sick_employee'][el.date_start])
                        acc[el.orderSection]['sick_employee'][el.date_start] = [];
                    acc[el.orderSection]['sick_employee'][el.date_start].push(el);
                    break;
                }
            case "vacation":
            case "family_circumstances":
            case "health_circumstances":
                if (!acc[el.orderSection][el.absence_type][el.date_start])
                    acc[el.orderSection][el.absence_type][el.date_start] = [];
                acc[el.orderSection][el.absence_type][el.date_start].push(el);
                break;
            default:
                acc[el.orderSection].push(el);
                break;
        }
        return acc;
    }, {})
}

const withDestionation = [
    "mission",
    "medical_care",
    "medical_board"
];

const withoutDestination = [
    "sick_leave",
    "vacation",
    "family_circumstances",
    "health_circumstances"
]

function GenerateArriveClauses(arrivePullSection, starting_index = 1) {
    let directive = "";
    let middleCount = 1;
    for (let absence_type of withDestionation) {
        if (arrivePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            for (let destination in arrivePullSection[absence_type]) {
                directive += `${starting_index}.${middleCount}.${innerCount++}. З ${destination}`;

                // If there are more than one returning date from one destination point will generate separate dates within the clause
                // У випадку якщо з одного місця поверталися в різні дати, створює окремі підпункти під кожну дату
                directive += Object.keys(arrivePullSection[absence_type][destination]).length === 1 ? " " : ":\n\n";
                for (let date in arrivePullSection[absence_type][destination]) {
                    if (arrivePullSection[absence_type][destination][date].length > 0) {
                        directive += `${FormatDate(new Date(date), false)}:\n\n`;
                        for (let servant of arrivePullSection[absence_type][destination][date]) {
                            directive += `${GenerateFullTitle(servant.servants)}.\n\n`;
                            directive += GenerateAddToRation(servant.servants);
                        }
                        directive += `${GenerateJustification(arrivePullSection[absence_type][destination][date])}\n\n`;
                    }
                }
            }
        }
        middleCount++;
    }

        console.log(directive)
        // if (arrivePullSection['medical_care'] && arrivePullSection['medical_care'].length > 0) {
        //     let medical_care = arrivePullSection['medical_care'];
        //     for (let i = 0, n = medical_care.length; i < n; i++) {
        //         directive += `${starting_index}.${middleCount}. З ${medical_care[i].destination} ${FormatDate(new Date(medical_care[i].date_start), false)}:\n\n`;
        //         directive += `${GenerateFullTitle(medical_care[i].servants)}.\n\n`;
        //         directive += `${GenerateAddToRation(medical_care[i].servants)}\n\n`;
        //         directive += `${GenerateJustification(medical_care[i])}\n\n`;
        //         middleCount++;
        //     }
        // }
        // if (arrivePullSection['medical_board'] && arrivePullSection['medical_board'].length > 0) {
        //     let medical_board = arrivePullSection['medical_board'];
        //     for (let i = 0, n = medical_board.length; i < n; i++) {
        //         directive += `${starting_index}.${middleCount}. З ${medical_board[i].destination} ${FormatDate(new Date(medical_board[i].date_start), false)}:\n\n`;
        //         directive += `${GenerateFullTitle(medical_board[i].servants)}.\n\n`;
        //         directive += `${GenerateAddToRation(medical_board[i].servants)}\n\n`;
        //         directive += `${GenerateJustification(medical_board[i])}\n\n`;
        //         middleCount++;
        //     }
        // }
        // if (arrivePullSection['vacation'] && arrivePullSection['vacation'].length > 0) {
        //     directive += `${starting_index}.${middleCount}. З щорічної основної відпустки:\n\n`;
        //     let vacation = arrivePullSection['vacation'];
        //     for (let i = 0, n = vacation.length; i < n; i++) {
        //         directive += `${FormatDate(new Date(vacation[i].date_start), false)}:\n\n`;
        //         let servants = GenerateFullTitle(vacation[i].servants);
        //         directive += `${starting_index}.${middleCount}.${i+1}. ${servants[0].toLocaleUpperCase() + servants.slice(1)}.\n\n`;
        //         directive += `${GenerateAddToRation(vacation[i].servants)}\n\n`;
        //         directive += `${GenerateJustification(vacation[i])}\n\n`;
        //     }
        //     middleCount++;
        // }
        // if (arrivePullSection['family_circumstances'] && arrivePullSection['family_circumstances'].length > 0) {
        //     let family_circumstances = arrivePullSection['family_circumstances'];
        //     directive += `${starting_index}.${middleCount}. З відпустки за сімейними обставинами:\n\n`;
        //     for (let i = 0, n = family_circumstances.length; i < n; i++) {
        //         directive += `${FormatDate(new Date(family_circumstances[i].date_start), false)}:\n\n`;
        //         let servants = GenerateFullTitle(family_circumstances[i].servants);
        //         directive += `${starting_index}.${middleCount}.${i+1}. ${servants[0].toLocaleUpperCase() + servants.slice(1)}.\n\n`;
        //         directive += `${GenerateAddToRation(family_circumstances[i].servants)}\n\n`;
        //         directive += `${GenerateJustification(family_circumstances[i])}\n\n`;
        //     }
        //     middleCount++;
        // }
        // if (arrivePullSection['health_circumstances'] && arrivePullSection['health_circumstances'].length > 0) {
        //     let health_circumstances = arrivePullSection['health_circumstances'];
        //     directive += `${starting_index}.${middleCount}. З відпустки за станом здоров'я:\n\n`;
        //     for (let i = 0, n = health_circumstances.length; i < n; i++) {
        //         directive += `${starting_index}.${middleCount}.${i+1}. ${FormatDate(new Date(health_circumstances[i].date_start), false)}:\n\n`;
        //         let servants = GenerateFullTitle(health_circumstances[i].servants);
        //         directive += `${starting_index}.${middleCount}.${i+1}. ${servants[0].toLocaleUpperCase() + servants.slice(1)}.\n\n`;
        //         directive += `${GenerateAddToRation(health_circumstances[i].servants)}\n\n`;
        //         directive += `${GenerateJustification(health_circumstances[i])}\n\n`;
        //     }
        //     middleCount++;
        // }
    console.log(directive);
    return directive;
}

function GenerateDepartureClauses(departurePull, starting_index = 2) {}

function GenerateOtherClauses(otherClausesPull, starting_index = 3) {}
