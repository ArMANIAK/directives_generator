"use client";

import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export default function Selector({ handleChange, label, list, name, value }) {

    const chosenOption = list.find(el => el.value === value) || { label: "", value: "" };
    const autocompleteChangeHandler = (event, value)  => {
        let val = value ? value.value : undefined;
        handleChange({ ...event, target: { name, value: val } });
    }

    return (
        <>
            <Autocomplete
                onChange={ autocompleteChangeHandler }
                disablePortal
                value={ chosenOption }
                name={ name }
                renderInput={ (params) => <TextField { ...params } label={ label } /> }
                options={ list }
            />
        </>
    )
}