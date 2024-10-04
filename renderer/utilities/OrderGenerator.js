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
    "vacation",
    "family_circumstances",
    "health_circumstances",
    "sick_leave",
    "sick_employee"
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
                            if (!isEmployee(servant.servants))
                                directive += GenerateAddToRation(servant.servants);
                        }
                        directive += `${GenerateJustification(arrivePullSection[absence_type][destination][date])}\n\n`;
                    }
                }
            }
            middleCount++;
        }
    }
    for (let absence_type of withoutDestination) {
        if (arrivePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            let header = "";
            switch (absence_type) {
                case "sick_leave":
                    header = "Які були звільнені від виконання службових обов'язків у зв'язку з хворобою";
                    break;
                case "sick_employee":
                    header = "Працівників Збройних Сил України вважати такими, що перебували на амбулаторному лікуванні";
                    break;
                case "vacation":
                    header = "З щорічної відпустки";
                    break;
                case "family_circumstances":
                    header = "З відпустки за сімейними обставинами"
                    break;
                case "health_circumstances":
                    header = "З відпустки за станом здоров'я"
                    break;
            }
            directive += `${starting_index}.${middleCount}.${innerCount++}. ${header}`;

            // If there are more than one returning date from one destination point will generate separate dates within the clause
            // У випадку якщо з одного місця поверталися в різні дати, створює окремі підпункти під кожну дату
            directive += Object.keys(arrivePullSection[absence_type]).length === 1 ? " " : ":\n\n";
            for (let date in arrivePullSection[absence_type]) {
                if (arrivePullSection[absence_type][date].length > 0) {
                    directive += `${FormatDate(new Date(date), false)}:\n\n`;
                    for (let servant of arrivePullSection[absence_type][date]) {
                        directive += `${GenerateFullTitle(servant.servants)}.\n\n`;
                        if (!isEmployee(servant.servants))
                            directive += GenerateAddToRation(servant.servants);
                    }
                    directive += `${GenerateJustification(arrivePullSection[absence_type][date])}\n\n`;
                }
            }
        }
        middleCount++;
    }

    console.log(directive);
    return directive;
}

function GenerateDepartureClauses(departurePull, starting_index = 2) {}

function GenerateOtherClauses(otherClausesPull, starting_index = 3) {}
