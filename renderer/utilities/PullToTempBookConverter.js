import {dateMath, datePickerToDateString, dateToDatepickerString, formatDate, getDateDifference} from "./DateUtilities";
import { GenerateName, GenerateRankNameByServantId } from "./ServantsGenerators";

const absence_type = require('../dictionaries/absence_types.json');

const convertPullToTempBook = row => {
    let result = {
        "certificate": row.certificate,
        "certificate_issue_date": row.certificate_issue_date ? formatDate(new Date(row.certificate_issue_date)) : "",
        "rank": row.servant_id ? GenerateRankNameByServantId(row.servant_id, "nominative") : "",
        "servant_name": row.servant_id ? GenerateName(row.servant_id, "nominative", "full") : "",
        "servant_id": row.servant_id,
        "absence_type": absence_type.find(el => el.value.toLowerCase() === row.absence_type.toLowerCase())?.label ?? "",
        "date_start": row.date_start ? formatDate(new Date(row.date_start)) : "",
        "destination": row.destination,
        "planned_date_end": row.planned_date_end ? formatDate(new Date(row.planned_date_end)) : "",
        "with_ration_certificate": row.with_ration_certificate ? "так" : "ні"
    }
    result.day_count = row.day_count
        ? (row.trip_days ? `${row.day_count}+${row.trip_days}` : row.day_count)
        : (row.date_start && row.planned_date_end ? getDateDifference(new Date(row.date_start), new Date(row.planned_date_end)) : "?");
    if (row.orderSection === "arrive") {
        result.arrive_order_no = row.order_no;
        result.arrive_order_date = row.order_date ? formatDate(new Date(row.order_date)) : "";
        result.fact_date_end = row.fact_date_end ? formatDate(new Date(row.fact_date_end)) : "";
    }
    else if (row.orderSection === "depart") {
        result.depart_order_no = row.order_no;
        result.depart_order_date = row.order_date ? formatDate(new Date(row.order_date)) : "";
    }
    if (['health_circumstances', 'vacation', 'family_circumstances'].includes(row.absence_type) && row.trip_days) {
        if (row.trip_days)
        result.planned_date_end = formatDate(dateMath(row.planned_date_end, row.trip_days));
    }
    return result;
}

const convertTempBookToPull = record => {
    let start, end;
    if (record.date_start)
        start = datePickerToDateString(record.date_start)
    if (record.planned_date_end)
        end = datePickerToDateString(record.planned_date_end)
    let result = {
        "servant_id": record.servant_id,
        "absence_type": absence_type.find(el => el.label.toLowerCase() === record.absence_type.toLowerCase())?.value ?? "",
        "date_start": start ?? "",
        "planned_date_end": end ?? "",
        "fact_date_end": datePickerToDateString(record.fact_date_end),
        "single_day": start === end,
        "until_order": !end,
        "destination": record.destination,
        "certificate": record.certificate,
        "certificate_issue_date": record.certificate_issue_date ? datePickerToDateString(record.certificate_issue_date) : "",
        "with_ration_certificate": record.with_ration_certificate === "так",
        "from_temp_book": true,
    }
    if ((String (record.day_count)).indexOf("+") !== -1) {
        [ result.day_count, result.trip_days ] = record.day_count.split("+")
    } else {
        result.day_count = record.day_count !== "?" ? record.day_count : "";
        result.trip_days = "";
    }
    if (parseInt(result.trip_days)) result.planned_date_end = dateToDatepickerString(dateMath(result.planned_date_end, result.trip_days, "subtract"))
    return result;
}

export { convertTempBookToPull, convertPullToTempBook }