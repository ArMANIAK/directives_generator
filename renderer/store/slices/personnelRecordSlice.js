import {  createSlice } from '@reduxjs/toolkit'

const initialState = {
    "clause_type": "rank_change",
    "servant_id": "",
    "servants": [""],
    "new_rank": "",
    "new_title_index": "",
    "VAT": "",
    "VATs": [""],
    "position_category": "",
    "new_position_category": "",
    "year_of_birth": "",
    "years_of_birth": [""],
    "education": "",
    "service_period": "",
    "service_periods": [""],
    "reassignment_reason": "",
    "subordinate": "",
    "justification": "",
    "articles_no": "",
    "clauses_no": "",
    "contract_term": "",
    "registration": "",
    "may_wear_uniform": "",
    "retire_date": "",
    "retire_reason": "",
    "new_name": ""
}

export const personnelRecordSlice = createSlice({
    name: 'personnelRecord',
    initialState,
    reducers: {
        setPersonnelRecord: (state, action) => {
            let newState = { ...state }
            for (let prop in action.payload)
                newState[prop] = action.payload[prop]
            return newState
        },
        resetPersonnelRecord: (state) => {
            return { ...initialState, clause_type: state.clause_type };
        },
        setPersonnelRecordArray: (state, action) => {
            const { field, index, value } = action.payload;
            state[field][index] = value
        },
        addPersonnelServantRecord: (state) => {
            state.servants.push("");
            state.VATs.push("");
            state.years_of_birth.push("");
            state.service_periods.push("");
        },
        deletePersonnelServantRecord: (state, action) => {
            let index = action.payload
            state.servants.splice(index, 1);
            state.VATs.splice(index, 1);
            state.years_of_birth.splice(index, 1);
            state.service_periods.splice(index, 1);
        },
    }
})

export const {
    setPersonnelRecord,
    resetPersonnelRecord,
    setPersonnelRecordArray,
    addPersonnelServantRecord,
    deletePersonnelServantRecord
} = personnelRecordSlice.actions

export default personnelRecordSlice.reducer