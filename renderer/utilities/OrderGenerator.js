import {convertAmountIntoWords, getServantById, isEmployee, isFemale} from "../services/ServantsService";
const certificate = require("../dictionaries/certificates.json");

import {formatDate, dateMath, dateStartToEndFormat, dayEnding} from "./DateUtilities";
import {
    GenerateFullTitleByTitleIndex,
    GenerateRankAndName,
    GenerateRankName,
    GenerateServantRankNameAndTitle,
    GetTitleIndex
} from "./ServantsGenerators";

function GenerateAddToRation(servant_id, order_date = null) {
    const servant = getServantById(servant_id);
    // If supplier is not set up or a servant is an employee no add to ration is added
    // Якщо для військовослужбовця не встановлено частину забезпечення котловим або він працівник ЗСУ, зарахування на котлове не відбувається
    if (!servant?.supplied_by || !servant?.rank) return "";
    const tomorrow = dateMath(order_date ? new Date(order_date) : new Date(), 1);
    const formattedTomorrow = formatDate(tomorrow, false);
    return `Зарахувати ${GenerateRankAndName(servant_id)} на котлове забезпечення при ${servant.supplied_by} за каталогом продуктів - зі сніданку ${formattedTomorrow}.\n\n`
}

function GenerateRemoveFromRation(servant_id, order_date, with_ration_certificate = false) {
    const servant = getServantById(servant_id);
    // If supplier is not set up or a servant is an employee no add to ration is added
    // Якщо для військовослужбовця не встановлено частину забезпечення котловим або він працівник ЗСУ, зняття з котлового не відбувається
    if (!servant?.supplied_by || !servant?.rank) return "";
    let paragraph = `Зняти ${GenerateRankAndName(servant_id)} з котлового забезпечення при ${servant.supplied_by} за каталогом продуктів - зі сніданку ${order_date}`;
    if (with_ration_certificate) paragraph += " та видати продовольчий атестат";
    paragraph += ".\n\n";
    return paragraph;
}

function GenerateServantBlock(
    {
        servant_id,
        start_date,
        order_date,
        with_ration_certificate,
        start_substituting,
        stop_substituting,
        substituting_servants
  },
    addOrRemove = "add",
    isCapitalised = false
) {
    let servant = `${GenerateServantRankNameAndTitle(servant_id)}.\n\n`;
    let block = isCapitalised ? servant[0].toLocaleUpperCase() + servant.slice(1) : servant;
    if (start_substituting && substituting_servants)
        block += `Тимчасове виконання обовʼязків за посадою ${GenerateFullTitleByTitleIndex(GetTitleIndex(servant_id))} ` +
            `покласти на ${GenerateServantRankNameAndTitle(substituting_servants)}.\n\n`;
    else if (stop_substituting && substituting_servants) {
        let subst_servant = GenerateRankAndName(substituting_servants, "dative");
        if (subst_servant)
            block += `${subst_servant[0].toLocaleUpperCase() + subst_servant.slice(1)} повернутися до виконання обовʼязків ` +
                `за посадою ${GenerateFullTitleByTitleIndex(GetTitleIndex(substituting_servants))}.\n\n`;
    }
    if (!isEmployee(servant_id) && addOrRemove === "add")
        block += GenerateAddToRation(servant_id, order_date);
    if (!isEmployee(servant_id) && addOrRemove === "remove") {
        let dateToRemove;
        if (start_date > order_date) {
            dateToRemove = new Date(start_date);
        } else {
            dateToRemove = dateMath(new Date(order_date), 1);
        }
        block += GenerateRemoveFromRation(servant_id, formatDate(dateToRemove, false), with_ration_certificate);
    }
    return block
}

function GenerateCertificatesRange(records) {
    if (records.length < 1) return "";
    let groupedRecords = records.reduce((acc, el) => {
        let date = formatDate(new Date(el.certificate_issue_date));
        if (!acc[date]) acc[date] = [el.certificate];
        else acc[date].push(el.certificate);
        return acc;
    }, {})
    let result = records.length > 1 ? certificate[records[0]['absence_type']]['plural'] : certificate[records[0]['absence_type']]['singular'];
    result += " ";
    for (let date in groupedRecords) {
        result += `від ${date} ${groupedRecords[date].length > 1 ? '№№ ' : '№ '}`;
        groupedRecords[date].sort();
        for (let i = 0, n = groupedRecords[date].length; i < n; i++) {
            result += groupedRecords[date][i] + ", ";
        }
    }
    return result.substring(0, result.length - 2);
}

function GenerateJustification(records) {
    let justification = 'Підстава: ';
    if (records[0].orderSection === "depart" && records[0].reason)
        justification += `${records[0].reason}, `;

    justification += GenerateCertificatesRange(records) ;
    if (records[0].ration_certificate) {
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
    if (other?.assignment) {
        directive += GenerateAssignmentClauses(other, starting_index)
        starting_index += other.assignment.length
    }
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
    if (!groupedPull.other_points)
        groupedPull.other_points = {};
    if (!groupedPull.other_points[record.sectionType])
        groupedPull.other_points[record.sectionType] = [];
    groupedPull.other_points[record.sectionType].push(record);
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
    if (["mission", "sick_leave", "health_circumstances"].includes(record.absence_type))
        groupDate = dateStartToEndFormat(record.date_start, record.planned_date_end);
    if (record.absence_type === "mission" && !record.planned_date_end)
        groupDate += " до окремого розпорядження";

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
            groupedPull.depart[record.absence_type][record.destination][groupDate][record.purpose].push(record);
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
            groupedPull.depart[record.absence_type][record.destination][groupDate].push(record);
            break;
        case "sick_leave":
            if (isEmployee(record.servant_id)) break;
            if (!groupedPull.depart[record.absence_type])
                groupedPull.depart[record.absence_type] = {};
            if (!groupedPull.depart[record.absence_type][groupDate])
                groupedPull.depart[record.absence_type][groupDate] = [];
            groupedPull.depart[record.absence_type][groupDate].push(record);
            break;
        case "vacation":
        case "family_circumstances":
        case "health_circumstances":
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

function GenerateAssignmentClauses(otherPullSection, starting_index = 1) {
    if (!otherPullSection.assignment) return "";
    let directive = "";
    for (let servant of otherPullSection.assignment) {
        let settings = servant.settings;
        const tomorrow = dateMath(servant.order_date ? new Date(servant.order_date) : new Date(), 1);
        const formattedTomorrow = formatDate(tomorrow, false);
        let servantRankAccusative = GenerateRankName(settings.rank, settings.speciality, "accusative");
        let servantRankGenitive = GenerateRankName(settings.rank, settings.speciality, "genitive");
        directive += `${starting_index++}. ${servantRankAccusative[0].toLocaleUpperCase() + servantRankAccusative.slice(1)} ${settings.last_name_accusative} ${settings.first_name_accusative}, ` +
            `призначен${settings.gender === "ж" ? "у" : "ого"} наказом ${settings.nomenclature} (по особовому складу) від ` +
            `${formatDate(settings.order_date, false)} № ${settings.order_no} на посаду ` +
            `${GenerateFullTitleByTitleIndex(settings.title_index)}, ВОС-${settings.MOS}, як${settings.gender === "ж" ? "а" : "ий"} ` +
            `прибу${settings.gender === "ж" ? "ла" : "в"} з ${settings.arrived_from}, з ${formatDate(settings.arrival_date, false)} ` +
            `зарахувати до списків особового складу частини на всі види забезпечення `;
        if (settings.assigned_date)
            directive += `та вважати так${settings.gender === "ж" ? "ою" : "им"}, що з ${formatDate(settings.assigned_date, false)} ` +
            `справи та посаду прийня${isFemale(servant.servant_id) ? "ла" : "в"} ` +
            `і приступи${isFemale(servant.servant_id) ? "ла" : "в"} до виконання службових обов’язків за посадою`;
        directive += `.\nЗарахувати ${servantRankAccusative} ${settings.last_name_accusative} ${settings.first_name_short} на котлове забезпечення при ` +
            `${settings.supplied_by} за каталогом продуктів – зі сніданку ${formattedTomorrow}.\n`;
        directive += `Встановити посадовий оклад згідно з тарифним розрядом ${settings.tarif} у сумі ${settings.amount} ` +
            `(${convertAmountIntoWords(settings.amount)} 00 копійок на місяць.\n` +
            `Виплачувати щомісячну премію за особистий внесок у загальні результати служби в розмірі ` +
            `${settings.bonus} %${!settings.state_secret ? " та" : ","} надбавку за особливе проходження служби у розмірі ` +
            `${settings.NOPS} % посадового окладу з урахуванням окладу за військовим званням`;
        if (settings.state_secret)
            directive += ` та надбавку за роботу в умовах режимних обмежень у розмірі ${settings.state_secret} % до посадового окладу ` +
                `з ${formatDate(settings.reassigned_date, false)}`;
        directive += `.\nВступний інструктаж з охорони праці пройшов ${formatDate(settings.arrival_date, false)}.\n\n` +
            `Підстава: припис ${settings.prescription_issuer} від ${formatDate(settings.prescription_date)} № ${settings.prescription_no} ` +
            `(вх. № ${settings.registry_prescription_no} від ${formatDate(settings.registry_prescription_date)}), витяг із наказу ` +
            `${settings.nomenclature} (по особовому складу) від ${formatDate(settings.order_date, false)} № ${settings.order_no}`;
        if (settings.ration_certificate_no)
            directive += `, продовольчий атестат від ${formatDate(settings.ration_certificate_date)} № ${settings.ration_certificate_no}`;
        directive += `, рапорт ${servantRankGenitive} ${settings.last_name_genitive} ` +
            `${settings.first_name_short} (вх. № ${servant.certificate} від ${formatDate(servant.certificate_issue_date)}).\n\n`;
    }
    return directive;
}

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
                        directive += GenerateServantBlock(servant);
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
                            directive += GenerateServantBlock(servant, "add", withSubClauses);
                        }
                        directive += `${GenerateJustification(arrivePullSection[absence_type][destination][date])}`;
                    }
                }
                middleCount++;
            }
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
                    directive += `${formatDate(new Date(date), false)}:\n\n`;
                    for (let servant of arrivePullSection[absence_type][date]) {
                        let withSubClauses = false
                        if (arrivePullSection[absence_type][date].length > 1) {
                            withSubClauses = true;
                            directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                        }
                        directive += GenerateServantBlock(servant, "add", withSubClauses);
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
                        directive += GenerateServantBlock(servant, "remove");
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
                            directive += GenerateServantBlock(servant, "remove", withSubClauses);
                            directive += "Підстава: рапорт " + GenerateRankAndName(servant.servant_id, "genitive") +
                                " (вх. № " + servant.reason + "), " + certificate[servant.absence_type]['singular'] + " № " + servant.certificate +
                                " від " + formatDate(new Date(servant.certificate_issue_date)) + ".\n\n";
                        }
                    }
                }
                middleCount++;
            }
        }
    }
    for (let absence_type of ['vacation', 'family_circumstances', 'health_circumstances']) {
        if (departurePullSection.hasOwnProperty(absence_type)) {
            let innerCount = 1;
            let header = "";
            switch (absence_type) {
                case "vacation":
                    header = "У щорічну відпустку:\n\n";
                    break;
                case "family_circumstances":
                    header = `У відпустку за сімейними обставинами та з інших поважних причин відповідно до Закону ` +
                        `України “Про соціальний і правовий захист військовослужбовців та членів їх сімей”:\n\n`
                    break;
                case "health_circumstances":
                    header = "У відпустку для лікування у звʼязку з хворобою або для лікування після поранення (контузії, травми або каліцтва):\n\n"
                    break;
            }
            directive += `${starting_index}.${middleCount}. ${header}`;
            for (let servant of departurePullSection[absence_type]) {
                let withSubClauses = false;
                if (departurePullSection[absence_type].length > 1) {
                    withSubClauses = true;
                    directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                }
                let fullServantTitle = GenerateServantRankNameAndTitle(servant.servant_id);
                let block = withSubClauses ? fullServantTitle[0].toLocaleUpperCase() + fullServantTitle.slice(1) : fullServantTitle;
                let vacationTerm = "";
                switch (absence_type) {
                    case "vacation":
                        vacationTerm = dateStartToEndFormat(servant.date_start, servant.planned_date_end, isEmployee(servant.servant_id), false);
                        block += " в " + servant.destination + " на " + (parseInt(servant.day_count) < 10 ? "0" : "") + servant.day_count +
                            " " + dayEnding(servant.day_count) + " у частину щорічної відпустки " + vacationTerm + ".\n\n";
                        break;
                    case "health_circumstances":
                        vacationTerm = dateStartToEndFormat(servant.date_start, servant.planned_date_end, isEmployee(servant.servant_id), false);
                        block += " в " + servant.destination + " на " + (parseInt(servant.day_count) < 10 ? "0" : "") + servant.day_count +
                            " " + dayEnding(servant.day_count) + " " + vacationTerm + ".\n\n";
                        break;
                    case "family_circumstances":
                        vacationTerm = dateStartToEndFormat(servant.date_start, servant.planned_date_end, isEmployee(servant.servant_id));
                        block += " у " + servant.destination + " терміном " + vacationTerm + ".\n\n";
                        break;
                }

                directive += block;
                directive += GenerateTripDays(servant.trip_days);
                let dateToRemove;
                if (servant.date_start > servant.order_date) {
                    dateToRemove = servant.date_start;
                } else {
                    dateToRemove = dateMath(new Date(servant.order_date), 1);
                }
                directive += GenerateRemoveFromRation(servant.servant_id, formatDate(dateToRemove, false));
                directive += "Підстава: рапорт " + GenerateRankAndName(servant.servant_id, "genitive") +
                    " (вх. № " + servant.reason + "), " + certificate[servant.absence_type]['singular'] + " № " + servant.certificate +
                    " від " + formatDate(new Date(servant.certificate_issue_date)) + ".\n\n";

            }
            middleCount++;
        }
    }
    if (departurePullSection.sick_leave) {
        let innerCount = 1;
        directive += `${starting_index}.${middleCount}. Нижчепойменованих військовослужбовців звільнити від виконання службових обов'язків у зв'язку з хворобою`;

        directive += Object.keys(departurePullSection.sick_leave).length === 1 ? " " : ":\n\n";
        let withSubClauses = false
        if (Object.keys(departurePullSection.sick_leave).length > 1
            || Object.values(departurePullSection.sick_leave).flat().length > 1)
                withSubClauses = true;
        for (let date in departurePullSection.sick_leave) {
            if (departurePullSection.sick_leave[date].length > 0) {
                directive += `${date}:\n\n`;
                for (let servant of departurePullSection.sick_leave[date]) {
                    if (withSubClauses)
                        directive += `${starting_index}.${middleCount}.${innerCount++}. `;
                    directive += GenerateServantBlock(servant, "remove", withSubClauses);

                    directive += "Підстава: рапорт " + GenerateRankAndName(servant.servant_id, "genitive") +
                        " (вх. № " + servant.reason + "), " + certificate[servant.absence_type]['singular'] + " № " + servant.certificate +
                        " від " + formatDate(new Date(servant.certificate_issue_date)) + ".\n\n";
                }
            }
        }
        middleCount++;
    }

    return directive;
}

function GenerateOtherClauses(otherClausesPull, starting_index = 3) {
    if (!Object.keys(otherClausesPull)) return "";
    let directive = "";
    if (otherClausesPull.reassignment) {
        for (let servant of otherClausesPull.reassignment) {
            let settings = servant.settings;
            let currentServant = GenerateRankAndName(servant.servant_id, "accusative", "full");
            directive += `${starting_index++}. ${currentServant[0].toLocaleUpperCase() + currentServant.slice(1)}, ` +
                GenerateFullTitleByTitleIndex(settings.old_title_index, "accusative") +
                `, призначен${isFemale(servant.servant_id) ? "у" : "ого"} наказом ${settings.nomenclature} (по особовому складу) від ` +
                `${formatDate(settings.order_date, false)} № ${settings.order_no} на посаду ` +
                `${GenerateFullTitleByTitleIndex(settings.title_index)}, ВОС-${settings.MOS}, вважати так${isFemale(servant.servant_id) ? "ою" : "им"}, ` +
                `що з ${formatDate(settings.reassigned_date, false)} справи та посаду прийня${isFemale(servant.servant_id) ? "ла" : "в"} ` +
                `і приступи${isFemale(servant.servant_id) ? "ла" : "в"} до виконання службових обов’язків за посадою. Встановити посадовий оклад ` +
                `згідно з тарифним розрядом ${settings.tarif} у сумі ${settings.amount} (${convertAmountIntoWords(settings.amount)} 00 копійок, ` +
                `шпк “${settings.position_category}”.\nВиплачувати щомісячну премію за особистий внесок у загальні результати служби в розмірі ` +
                `${settings.bonus} %${!settings.state_secret ? " та" : ","} надбавку за особливе проходження служби у розмірі ` +
                `${settings.NOPS} % посадового окладу з урахуванням окладу за військовим званням`;
            if (settings.state_secret)
                directive += ` та надбавку за роботу в умовах режимних обмежень у розмірі ${settings.state_secret} % до посадового окладу ` +
                    `з ${formatDate(settings.reassigned_date, false)}`;
            directive += `.\n\nПідстава: витяг із наказу ${settings.nomenclature} (по особовому складу) від ${formatDate(settings.order_date, false)} ` +
                `№ ${settings.order_no}, рапорт ${GenerateRankAndName(servant.servant_id, "genitive")} (вх. № ${servant.certificate} від ${servant.certificate_issue_date}).\n\n`;
        }
    }
    if (otherClausesPull.financial_support) {
        let middle_ind = 1;
        directive = `виплатити грошову допомогу на оздоровлення за ${(new Date()).getFullYear()} рік згідно з ` +
            `наказом Міністерства оборони України від 07.06.2018 № 260 "Про затвердження Порядку виплати грошового забезпечення` +
            ` військовослужбовцям Збройних Сил України та деяким іншим особам" у розмірі місячного грошового забезпечення`;
        if (otherClausesPull.financial_support.length > 1) {
            directive = starting_index + ". Нижчепойменованим військовослужбовцям " + directive + ":\n\n";
            for (let servant of otherClausesPull.financial_support) {
                let currentServant = GenerateServantRankNameAndTitle(servant.servant_id, "dative", "full");
                directive += `${starting_index}.${middle_ind++}. ` + currentServant[0].toLocaleUpperCase() +
                    currentServant.slice(1) + ".\n\n" + "Підстава: рапорт " +
                    GenerateRankAndName(servant.servant_id, "genitive") + " (вх. № " + servant.certificate +
                    " від " + formatDate(new Date(servant.certificate_issue_date)) + ").\n\n";
            }
        } else {
            let servant = GenerateServantRankNameAndTitle(otherClausesPull.financial_support[0]["servant_id"], "dative", "full");
            directive = `${starting_index}. ` + servant[0].toLocaleUpperCase() + servant.slice(1) + " " + directive + ".\n\n" + "Підстава: рапорт " +
                GenerateRankAndName(otherClausesPull.financial_support[0].servant_id, "genitive") +
                " (вх. № " + otherClausesPull.financial_support[0].certificate + " від " +
                formatDate(new Date(otherClausesPull.financial_support[0].certificate_issue_date)) + ").\n\n";
        }
        starting_index++;
    }
    if (otherClausesPull.social_support) {
        let middle_ind = 1;
        let text = ` виплатити матеріальну допомогу для вирішення соціально-побутових питань за ${(new Date()).getFullYear()} рік згідно з ` +
            `наказом Міністерства оборони України від 07.06.2018 № 260 "Про затвердження Порядку виплати грошового забезпечення` +
            ` військовослужбовцям Збройних Сил України та деяким іншим особам" у розмірі місячного грошового забезпечення`;
        if (otherClausesPull.social_support.length > 1) {
            directive += starting_index + ". Нижчепойменованим військовослужбовцям " + text + ":\n\n";
            for (let servant of otherClausesPull.social_support) {
                let currentServant = GenerateServantRankNameAndTitle(servant.servant_id, "dative", "full");
                directive += `${starting_index}.${middle_ind++}. ` + currentServant[0].toLocaleUpperCase() +
                    currentServant.slice(1) + ".\n\n" + "Підстава: рапорт " +
                    GenerateRankAndName(servant.servant_id, "genitive") + " (вх. № " + servant.certificate +
                    " від " + formatDate(new Date(servant.certificate_issue_date)) + ").\n\n";
            }
        } else {
            let servant = GenerateServantRankNameAndTitle(otherClausesPull.social_support[0]["servant_id"], "dative", "full");
            directive += `${starting_index}. ` + servant[0].toLocaleUpperCase() + servant.slice(1) + " " + text + ".\n\n" + "Підстава: рапорт " +
                GenerateRankAndName(otherClausesPull.social_support[0].servant_id, "genitive") +
                " (вх. № " + otherClausesPull.social_support[0].certificate + " від " +
                formatDate(new Date(otherClausesPull.social_support[0].certificate_issue_date)) + ").\n\n";
        }
        starting_index++;
    }

    return directive;
}
