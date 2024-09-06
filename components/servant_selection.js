"use client";

import { GenerateName, GenerateRankName, GetGeneralDepartmentName } from "@/utilities/generators";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function ServantSelection({ handleChange }) {
    const servants = require("../dictionaries/servants.json");
    const servantsList = servants.map(el => {
        return {
            'label' : `${GenerateName(el.id, 'nominative')} - ${GetGeneralDepartmentName(el.department)}`,
            'id' : el.id
        }
    })
    const autocompleteChangeHandler = (event, value)  => {
        handleChange({...event, target: { name: "servant", value: value.id }})
    }

    return (
        <Autocomplete
            onChange={autocompleteChangeHandler}
            disablePortal
            // isOptionEqualToValue={(opt, val) => opt.id === val}
            renderInput={(params) => <TextField {...params} label="Військовослужбовець/працівник ЗСУ" />}
            options={servantsList}
        />
    )
}