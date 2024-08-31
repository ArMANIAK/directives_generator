"use client";

import { GenerateName, GetGeneralDepartmentName } from "@/utilities/generators";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function ServantSelection() {
    const servants = require("../dictionaries/servants.json");
    const servantsList = servants.map(el => {
        return {
            'label' : `${el.rank_nominative} ${GenerateName(el.id, 'nominative')} - ${GetGeneralDepartmentName(el.department)}`,
            'value' : el.id
        }
    })
    return (
        <Autocomplete
            disablePortal
            renderInput={(params) => <TextField {...params} label="Військовослужбовець/працівник ЗСУ" />}
            sx={{ width: 300 }}
            options={servantsList}
        />
    )
}