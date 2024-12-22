import { getServantById, isEmployee } from "../services/ServantsService";
const certificate = require("../dictionaries/certificates.json");

import { formatDate, dateMath, dateStartToEndFormat } from "./DateUtilities";
import { GenerateRankAndName, GenerateFullTitle } from "./ServantsGenerators";

function GenerateAddToRation(servant_id) {
    const servant = getServantById(servant_id);
    // If supplier is not set up or a servant is an employee no add to ration is added
    // Якщо для військовослужбовця не встановлено частину забезпечення котловим або він працівник ЗСУ, зарахування на котлове не відбувається
    if (!servant?.supplied_by || !servant?.rank) return "";
    const tomorrow = dateMath(new Date(), 1);
    const formattedTomorrow = formatDate(tomorrow, false);
    return `Зарахувати ${GenerateRankAndName(servant_id)} на котлове забезпечення при ${servant.supplied_by} за каталогом продуктів - зі сніданку ${formattedTomorrow}.\n\n`
}

function GenerateRemoveFromRation(servant_id, with_ration_certificate = false) {
    const servant = getServantById(servant_id);
    // If supplier is not set up or a servant is an employee no add to ration is added
    // Якщо для військовослужбовця не встановлено частину забезпечення котловим або він працівник ЗСУ, зняття з котлового не відбувається
    if (!servant?.supplied_by || !servant?.rank) return "";
    const tomorrow = dateMath(new Date(), 1);
    const formattedTomorrow = formatDate(tomorrow, false);
    let paragraph = `Зняти ${GenerateRankAndName(servant_id)} з котлового забезпечення при ${servant.supplied_by} за каталогом продуктів - зі сніданку ${formattedTomorrow}`;
    if (with_ration_certificate) paragraph += " та видати продовольчий атестат";
    paragraph += ".\n\n";
    return paragraph;
}

function GenerateServantBlock(
    servant_id,
    addOrRemove = "add",
    with_ration_certificate = false,
    isCapitalised = false
) {
    console.log("GENERATE SERVANT BLOCK", servant_id)
    let servant = `${GenerateFullTitle(servant_id)}.\n\n`;
    let block = isCapitalised ? servant[0].toLocaleUpperCase() + servant.slice(1) : servant;
    if (!isEmployee(servant_id) && addOrRemove === "add")
        block += GenerateAddToRation(servant_id);
    if (!isEmployee(servant_id) && addOrRemove === "remove")
        block += GenerateRemoveFromRation(servant_id, with_ration_certificate);
    return block
}

function GenerateJustification(records) {
    let justification = 'Підстава: ';
    let certificates = '';
    let ration_certificates = '';
    if (records[0].reason)
        justification += `${records[0].reason}, `;

    for (let i = 0, n = records.length; i < n; i++) {
        let record = records[i];
        certificates += `${certificate[record.absence_type]} № ${record.certificate} від ${formatDate(new Date(record.certificate_issue_date))}`;
        if (n !== 1 && i + 1 !== n) {
            certificates += ", ";
            if (record.with_ration_certificate)
                ration_certificates += ", ";
        }
    }
    justification += `${certificates}`;
    if (records[0].ration_certificate_issue_date) {
        justification += `, продовольчий атестат від ${formatDate(new Date(records[0].ration_certificate_issue_date))} № ${records[0].ration_certificate}`;
    }
    justification += '.\n\n';
    return justification;
}

const GenerateTripDays = tripDays => {
    if (!tripDays) return "";
    if (parseInt(tripDays) === 1) return `Надати 01 добу для проїзду до місця проведення відпустки та у зворотному напрямку.\n\n`;
    return `Надати 0${tripDays} доби для проїзду до місця проведення відпустки та у зворотному напрямку.\n\n`;
}

export function GenerateOrder(pull, starting_index = 1) {
    const groupedPull = GroupPull(pull)
console.dir(groupedPull);

    let directive = '';
    let arrive = groupedPull['arrive'];
    let depart = groupedPull['depart'];
    let other = groupedPull['other_points'];
    if (arrive) directive += GenerateArriveClauses(arrive, starting_index++);
    if (depart) directive += GenerateDepartureClauses(depart, starting_index++);
    if (other) directive += GenerateOtherClauses(other, starting_index++);

    return directive;
}

function GroupPull(pull) {
    return pull.reduce((acc, el) => {
        if (!acc[el.orderSection])
            acc[el.orderSection] = {}
        if (el.orderSection === 'other_points') return addOtherPointsClauseToPull(acc, el);
        if (el.orderSection === 'arrive') return addArriveClauseToPull(acc,el);
        if (el.orderSection === 'depart') return addDepartureClauseToPull(acc,el);

    }, {})
}

const addOtherPointsClauseToPull = (groupedPull, record) => {
    groupedPull.push(record);
    return groupedPull;
}
const addArriveClauseToPull = (groupedPull, record) => {
    if (!groupedPull.arrive[record.absence_type])
        groupedPull.arrive[record.absence_type] = {};

    switch (record.absence_type) {
        case "mission":
        case "medical_care":
        case "medical_board":
            if (!groupedPull.arrive[record.absence_type][record.destination])
                groupedPull.arrive[record.absence_type][record.destination] = {};
            if (!groupedPull.arrive[record.absence_type][record.destination][record.fact_date_end])
                groupedPull.arrive[record.absence_type][record.destination][record.fact_date_end] = [];
            groupedPull.arrive[record.absence_type][record.destination][record.fact_date_end].push(record)
            break;
        case "sick_leave":
            if (isEmployee(record.servant_id)) {
                if (!groupedPull.arrive['sick_employee'])
                    groupedPull.arrive['sick_employee'] = {}
                if (!groupedPull.arrive['sick_employee'][record.fact_date_end])
                    groupedPull.arrive['sick_employee'][record.fact_date_end] = [];
                groupedPull.arrive['sick_employee'][record.fact_date_end].push(record);
                break;
            }
        case "vacation":
        case "family_circumstances":
        case "health_circumstances":
            if (!groupedPull.arrive[record.absence_type][record.fact_date_end])
                groupedPull.arrive[record.absence_type][record.fact_date_end] = [];
            groupedPull.arrive[record.absence_type][record.fact_date_end].push(record);
            break;
        default:
            groupedPull.arrive.push(record);
            break;
    }
    return groupedPull;
}

const addDepartureClauseToPull = (groupedPull, record) => {
    let groupDate = record.date_start;
    if (record.absence_type === "mission" || record.absence_type === "sick_leave")
        groupDate = dateStartToEndFormat(record.date_start, record.planned_date_end)
    switch (record.absence_type) {
        case "mission":
            if (!groupedPull.depart[record.absence_type])
                groupedPull.depart[record.absence_type] = {};
            if (!groupedPull.depart[record.absence_type][record.destination])
                groupedPull.depart[record.absence_type][record.destination] = {};
            if (!groupedPull.depart[record.absence_type][record.destination][groupDate])
                groupedPull.depart[record.absence_type][record.destination][groupDate] = {};
            if (!groupedPull.depart[record.absence_type][record.destination][groupDate][record.purpose])
                groupedPull.depart[record.absence_type][record.destination][groupDate][record.purpose] = [];
            groupedPull.depart[record.absence_type][record.destination][groupDate][record.purpose].push(record)
            break;
        case "medical_care":
        case "medical_board":
            if (isEmployee(record.servant_id)) break;
            if (!groupedPull.depart[record.absence_type])
                groupedPull.depart[record.absence_type] = {};
            if (!groupedPull.depart[record.absence_type][record.destination])
                groupedPull.depart[record.absence_type][record.destination] = {};
            if (!groupedPull.depart[record.absence_type][record.destination][groupDate])
                groupedPull.depart[record.absence_type][record.destination][groupDate] = [];
            groupedPull.depart[record.absence_type][record.destination][groupDate].push(record)
            break;
        case "sick_leave":
            if (isEmployee(record.servant_id)) break;
        case "health_circumstances":
            if (!groupedPull.depart[record.absence_type])
                groupedPull.depart[record.absence_type] = {};
            if (!groupedPull.depart[record.absence_type][groupDate])
                groupedPull.depart[record.absence_type][groupDate] = [];
            groupedPull.depart[record.absence_type][groupDate].push(record);
            break;
        case "vacation":
        case "family_circumstances":
            if (!groupedPull.depart[record.absence_type])
                groupedPull.depart[record.absence_type] = [];
            groupedPull.depart[record.absence_type].push(record);
            break;
        default:
            groupedPull.depart.push(record);
            break;
    }
    return groupedPull;
}

const withDestination = [
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
    if (!Object.keys(arrivePullSection)) return "";
    let directive = `${starting_index}. Вважати такими, що прибули і приступили до виконання службових обов’язків:\n\n`;
    let middleCount = 1;
    if (arrivePullSection.hasOwnProperty("mission")) {
        directive += `${starting_index}.${middleCount}. З відрядження:\n\n`
        let innerCount = 1;
        for (let destination in arrivePullSection.mission) {
            directive += `${starting_index}.${middleCount}.${innerCount++}. З ${destination}`;

            // If there are more than one returning date from one destination point will generate separate dates within the clause
            // У випадку якщо з одного місця поверталися в різні дати, створює окремі підпункти під кожну дату
            directive += Object.keys(arrivePullSection.mission[destination]).length === 1 ? " " : ":\n\n";
            for (let date in arrivePullSection.mission[destination]) {
                if (arrivePullSection.mission[destination][date].length > 0) {
                    directive += `${formatDate(new Date(date), false)}:\n\n`;
                    for (let servant of arrivePullSection.mission[destination][date]) {
                        directive += GenerateServantBlock(servant.servant_id);
                    }
                    directive += `${GenerateJustification(arrivePullSection.mission[destination][date])}`;
                }
            }
        }
        middleCount++;
    }
    for (let absence_type of withDestination) {
        if (arrivePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            for (let destination in arrivePullSection[absence_type]) {
                directive += `${starting_index}.${middleCount}. З ${destination}`;

                // If there are more than one returning date from one destination point will generate separate dates within the clause
                // У випадку якщо з одного місця поверталися в різні дати, створює окремі підпункти під кожну дату
                directive += Object.keys(arrivePullSection[absence_type][destination]).length === 1 ? " " : ":\n\n";
                for (let date in arrivePullSection[absence_type][destination]) {
                    if (arrivePullSection[absence_type][destination][date].length > 0) {
                        directive += `${formatDate(new Date(date), false)}:\n\n`;
                        for (let servant of arrivePullSection[absence_type][destination][date]) {
                            let withSubClauses = false
                            if (arrivePullSection[absence_type][destination][date].length > 1) {
                                withSubClauses = true;
                                directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                            }
                            directive += GenerateServantBlock(servant.servant_id, "add", withSubClauses);
                        }
                        directive += `${GenerateJustification(arrivePullSection[absence_type][destination][date])}`;
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
            directive += `${starting_index}.${middleCount}. ${header}`;

            // If there are more than one returning date from one destination point will generate separate dates within the clause
            // У випадку якщо з одного місця поверталися в різні дати, створює окремі підпункти під кожну дату
            directive += Object.keys(arrivePullSection[absence_type]).length === 1 ? " " : ":\n\n";
            for (let date in arrivePullSection[absence_type]) {
                if (arrivePullSection[absence_type][date].length > 0) {
                    directive += `${date}:\n\n`;
                    for (let servant of arrivePullSection[absence_type][date]) {
                        let withSubClauses = false
                        if (arrivePullSection[absence_type][date].length > 1) {
                            withSubClauses = true;
                            directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                        }
                        directive += GenerateServantBlock(servant.servant_id, "add", withSubClauses);
                    }
                    directive += `${GenerateJustification(arrivePullSection[absence_type][date])}`;
                }
            }
            middleCount++;
        }
    }

    return directive;
}

function GenerateDepartureClauses(departurePullSection, starting_index = 2) {
    if (!Object.keys(departurePullSection)) return "";
    let directive = `${starting_index}. Вважати такими, що вибули:\n\n`;
    let middleCount = 1;
    if (departurePullSection.mission) {
        directive += `${starting_index}.${middleCount}. У відрядження:\n\n`;
        let innerCount = 1;
        for (let destination in departurePullSection.mission) {
            directive += `${starting_index}.${middleCount}.${innerCount++}. До ${destination}`;

            directive += Object.keys(departurePullSection.mission[destination]).length === 1 ? " " : ":\n\n";
            for (let date in departurePullSection.mission[destination]) {
                directive += date;
                directive += Object.keys(departurePullSection.mission[destination][date]).length === 1 ? " " : ":\n\n";
                for (let purpose in departurePullSection.mission[destination][date]) {
                    directive += `${purpose}:\n\n`;
                    for (let servant of departurePullSection.mission[destination][date][purpose]) {
                        directive += GenerateServantBlock(servant.servant_id, "remove", servant.with_ration_certificate);
                    }
                    directive += `${GenerateJustification(departurePullSection.mission[destination][date][purpose])}`;
                }
            }
        }
        middleCount++
    }
    for (let absence_type of withDestination) {
        if (departurePullSection.hasOwnProperty(absence_type)) {
            let purpose = absence_type === "medical_care"
                ? "для проходження стаціонарного лікування"
                : "для проходження військово-лікарської комісії";
            let innerCount = 1;
            for (let destination in departurePullSection[absence_type]) {
                directive += `${starting_index}.${middleCount}. До ${destination} ${purpose}`;

                directive += Object.keys(departurePullSection[absence_type][destination]).length === 1 ? " " : ":\n\n";
                for (let date in departurePullSection[absence_type][destination]) {
                    if (departurePullSection[absence_type][destination][date].length > 0) {
                        directive += `з ${formatDate(new Date(date), false)}:\n\n`;
                        for (let servant of departurePullSection[absence_type][destination][date]) {
                            let withSubClauses = false
                            if (departurePullSection[absence_type][destination][date].length > 1) {
                                withSubClauses = true;
                                directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                            }
                            directive += GenerateServantBlock(servant.servant_id, "remove", servant.with_ration_certificate, withSubClauses);
                        }
                        directive += `${GenerateJustification(departurePullSection[absence_type][destination][date])}`;
                    }
                }
                middleCount++;
            }
        }
    }
    for (let absence_type of ['vacation', 'family_circumstances']) {
        if (departurePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            let header = "";
            switch (absence_type) {
                case "vacation":
                    header = "У щорічну відпустку:\n\n";
                    break;
                case "family_circumstances":
                    header = `У відпустку за сімейними обставинами та з інших поважних причин відповідно до Закону \
                    України “Про соціальний і правовий захист військовослужбовців та членів їх сімей”:\n\n`
                    break;
            }
            directive += `${starting_index}.${middleCount}. ${header}`;
            for (let servant of departurePullSection[absence_type]) {
                let withSubClauses = false;
                if (departurePullSection[absence_type].length > 1) {
                    withSubClauses = true;
                    directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                }
                let fullServantTitle = GenerateFullTitle(servant.servant_id);
                let block = withSubClauses ? fullServantTitle[0].toLocaleUpperCase() + fullServantTitle.slice(1) : fullServantTitle;
                let groupedDates = dateStartToEndFormat(servant.date_start, servant.planned_date_end, isEmployee(servant.servant_id));
                switch (absence_type) {
                    case "vacation":
                        block += " у частину щорічної відпустки за " + servant.date_start.substr(0,4) +
                            " рік до " + servant.destination + " " + groupedDates + ".\n\n";
                        break;
                    case "family_circumstances":
                        block += " у " + servant.destination + " терміном " + groupedDates + ".\n\n";
                        break;
                }

                directive += block;
                directive += GenerateTripDays(servant.trip_days);
                directive += GenerateRemoveFromRation(servant.servant_id, servant.with_ration_certificate);
                directive += "Підстава: рапорт " + GenerateRankAndName(servant.servant_id, "genitive") +
                    "(вх. № " + servant.reason + "), " + certificate[servant.absence_type] + " № " + servant.certificate +
                    " від " + formatDate(new Date(servant.certificate_issue_date)) + ".\n\n";

            }
            middleCount++;
        }
    }
    for (let absence_type of ['health_circumstances', 'sick_leave']) {
        if (departurePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            let header = "";
            switch (absence_type) {
                case "sick_leave":
                    header = "Нижчепойменованих військовослужбовців звільнити від виконання службових обов'язків у зв'язку з хворобою";
                    break;
                case "health_circumstances":
                    header = "У відпустку за станом здоровʼя на підставі статті 73 графи VI Розкладу хвороб"
                    break;
            }
            directive += `${starting_index}.${middleCount}. ${header}`;

            directive += Object.keys(departurePullSection[absence_type]).length === 1 ? " " : ":\n\n";
            for (let date in departurePullSection[absence_type]) {
                if (departurePullSection[absence_type][date].length > 0) {
                    directive += `${date}:\n\n`;
                    for (let servant of departurePullSection[absence_type][date]) {
                        let withSubClauses = false
                        if (departurePullSection[absence_type][date].length > 1) {
                            withSubClauses = true;
                            directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                        }
                        directive += GenerateTripDays(servant.trip_days);
                        directive += GenerateServantBlock(servant.servant_id, "remove", servant.with_ration_certificate, withSubClauses);
                    }
                    directive += `${GenerateJustification(departurePullSection[absence_type][date])}`;
                }
            }
            middleCount++;
        }
    }

    return directive;
}

function GenerateOtherClauses(otherClausesPull, starting_index = 3) {}
