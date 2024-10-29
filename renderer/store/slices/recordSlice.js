import {  createSlice } from '@reduxjs/toolkit'
import { DateToDatepickerString } from "../../utilities/DateUtilities";

const initialState = {
    "order_no": "",
    "order_date": DateToDatepickerString(new Date()),
    "orderSection": "arrive",
    "servants": [""],
    "absence_type": "mission",
    "date_start": DateToDatepickerString(new Date()),
    "date_end": "",
    "day_count": 0,
    "single_day": false,
    "until_order": false,
    "destination": "",
    "purpose": "",
    "reason": "",
    "certificate": [""],
    "certificate_issue_date": [""],
    "with_ration_certificate": false,
    "ration_certificate": "",
    "ration_certificate_issue_date": ""
}

export const recordSlice = createSlice({
    name: 'record',
    initialState,
    reducers: {
        setRecord: (state, action) => {
            console.log({state, payload: action.payload})
            for (let prop in action.payload)
                state[prop] = action.payload[prop]
            // return { ...state, ...action.payload }
        },
        resetRecord: () => {
            return initialState;
        },
        setRecordArray: (state, action) => {
            const { field, index, value } = action.payload;
            state[field][index] = value
        },
        addServantRecord: (state, action) => {
            state.servants.push("");
            state.certificate.push("");
            state.certificate_issue_date.push("");
        },
        deleteServantRecord: (state, action) => {
            let index = action.payload
            state.servants.splice(index, 1);
            state.certificate.splice(index, 1);
            state.certificate_issue_date.splice(index, 1);
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