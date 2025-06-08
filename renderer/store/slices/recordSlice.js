import { createSlice } from '@reduxjs/toolkit'
import { dateToDatepickerString } from "../../utilities/DateUtilities";

const initialState = {
    "id": "",
    "order_no": "",
    "order_date": dateToDatepickerString(new Date()),
    "orderSection": "arrive",
    "servants": [""],
    "absence_type": "mission",
    "date_start": dateToDatepickerString(new Date()),
    "planned_date_end": "",
    "fact_date_end": dateToDatepickerString(new Date()),
    "day_count": 0,
    "trip_days": 0,
    "single_day": false,
    "until_order": false,
    "destination": "",
    "purpose": "",
    "reason": "",
    "certificate": [""],
    "certificate_issue_date": [""],
    "with_ration_certificate": false,
    "ration_certificate": "",
    "ration_certificate_issue_date": "",
    "settings": {},
    "start_substituting": [""],
    "stop_substituting": [""],
    "substituting_servants": [""]
}

export const recordSlice = createSlice({
    name: 'record',
    initialState,
    reducers: {
        setRecord: (state, action) => {
            let newState = { ...state }
            for (let prop in action.payload)
                newState[prop] = action.payload[prop]
            return newState
        },
        resetRecord: (state) => {
            return { ...initialState,
                orderSection: state.orderSection,
                order_no: state.order_no,
                order_date: state.order_date
            };
        },
        setRecordArray: (state, action) => {
            const { field, index, value } = action.payload;
            state[field][index] = value
        },
        addServantRecord: (state) => {
            state.servants.push("");
            state.certificate.push("");
            state.certificate_issue_date.push("");
            state.start_substituting.push("");
            state.stop_substituting.push("");
            state.substituting_servants.push("");
        },
        deleteServantRecord: (state, action) => {
            let index = action.payload
            state.servants.splice(index, 1);
            state.certificate.splice(index, 1);
            state.certificate_issue_date.splice(index, 1);
            state.start_substituting.splice(index, 1);
            state.stop_substituting.splice(index, 1);
            state.substituting_servants.splice(index, 1);
        }
    }
})

export const {
    setRecord,
    resetRecord,
    setRecordArray,
    addServantRecord,
    deleteServantRecord
} = recordSlice.actions

export default recordSlice.reducer