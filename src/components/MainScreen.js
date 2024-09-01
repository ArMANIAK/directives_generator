"use client";

import ServantSelection from "@/components/servant_selection";
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField} from "@mui/material";
import {GenerateFullTitle} from "@/utilities/generators";

export default function MainScreen() {
    // const handleSelect = event => setServant(GenerateFullTitle(event.target.value))
    const [ record, setRecord ] = useState({
        "direction": "",
        "servant": "",
        "absence_type": "",
        "date_start": "",
        "date_end": "",
        "single_day": false,
        "until_order": false,
        "destination": "",
        "reason": "",
        "certificate": "",
        "certificate_issue_date": "",
        "ratio_certificate": "",
        "ratio_certificate_issue_date": ""
    })

    const absence_types = [
        {
            "label": "Відрядження",
            "value": "mission"
        },
        {
            "label": "Лікарняний",
            "value": "sick_leave"
        },
        {
            "label": "Стаціонар",
            "value": "medical_care"
        },
        {
            "label": "Відпустка основна",
            "value": "vacation"
        },
        {
            "label": "Відпустка за сімейними обставинами",
            "value": "family_circumstances"
        },
        {
            "label": "Відпустка за станом здоров'я",
            "value": "health_circumstances"
        },
        {
            "label": "ВЛК",
            "value": "medical_board"
        }
    ];

    const handleChange = event => console.dir(event.target) || setRecord({...record, [event.target.name]: event.target.value })

    console.log("RENDER ", record)

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container spacing={24}>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="arrive"
                        name="direction"
                        onChange={handleChange}
                    >
                        <FormControlLabel value="arrive" control={<Radio />} label="Прибуття" />
                        <FormControlLabel value="depart" control={<Radio />} label="Вибуття" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid container>
                <Grid size={6}>
                    <ServantSelection handleChange={handleChange}/>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            label={"Тип відсутності"}
                            slotProps={{inputLabel: {shrink: true}}}
                            value={record.absence_type}
                            select
                            name="absence_type"
                            onChange={handleChange} >
                            { absence_types.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container>
                <Grid direction={"row"}>
                    {/*<InputLabel>З </InputLabel>*/}
                    <TextField
                        label={"З"}
                        slotProps={{inputLabel: {shrink: true}}}
                        onChange={handleChange}
                        name={"date_start"}
                        type={"date"}
                    />
                </Grid>
                <Grid>
                    <TextField
                        onChange={handleChange}
                        type={'number'}
                        label={"На діб"}
                        slotProps={{inputLabel: {shrink: true}}}
                    />
                </Grid>
            </Grid>
            <Grid container>
                {record.servant === "" ? "" : GenerateFullTitle(record.servant, "nominative")}
            </Grid>
        </Grid>
    )
}