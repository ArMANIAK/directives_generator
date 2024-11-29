import { datePickerToDateString, formatDate, getDateDifference } from "./DateUtilities";
import { GenerateName, GenerateRankNameByServantId } from "./ServantsGenerators";

const absence_type = require('../dictionaries/absence_types.json');

const convertPullToTempBook = row => {
    let result = {
        "absence_type": absence_type.find(el => el.value.toLowerCase() === row.absence_type.toLowerCase())?.label ?? "",
        "servant_id": row.servant_id,
        "rank": row.servant_id ? GenerateRankNameByServantId(row.servant_id, "nominative") : "",
        "servant_name": row.servant_id ? GenerateName(row.servant_id, "nominative") : "",
        "certificate": row.certificate,
        "certificate_issue_date": row.certificate_issue_date ? formatDate(new Date(row.certificate_issue_date)) : "",
        "date_start": row.date_start ? formatDate(new Date(row.date_start)) : "",
        "destination": row.destination,
        "planned_date_end": row.planned_date_end ? formatDate(new Date(row.planned_date_end)) : "",
        "with_ration_certificate": row.with_ration_certificate ? "так" : "ні"
    }
    if (row.orderSection === "arrive") {
        result.arrive_order_no = row.order_no;
    }
    else if (row.orderSection === "depart") result.depart_order_no = row.order_no;
    return result;
}

const convertTempBookToPull = record => {
    let date_count = 0, start, end;
    if (record.date_start)
        start = datePickerToDateString(record.date_start)
    if (record.planned_date_end)
        end = datePickerToDateString(record.planned_date_end)
    if (record.date_start && record.planned_date_end)
        date_count = getDateDifference(start, end);
    return {
        "servant_id": record.servant_id,
        "absence_type": absence_type.find(el => el.label.toLowerCase() === record.absence_type.toLowerCase())?.value ?? "",
        "date_start": start ?? "",
        "planned_date_end": end ?? "",
        "fact_date_end": datePickerToDateString(record.fact_date_end),
        "day_count": date_count ?? "",
        "single_day": start === end,
        "until_order": !end,
        "destination": record.destination,
        "certificate": record.certificate,
        "certificate_issue_date": record.certificate_issue_date ? datePickerToDateString(record.certificate_issue_date) : "",
        "with_ration_certificate": record.with_ration_certificate === "так",
        "from_temp_book": true,
    }
}

export { convertTempBookToPull, convertPullToTempBook }