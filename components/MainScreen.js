"use client";

import ServantSelection from "../components/servant_selection";
import PullViewer from "../components/PullViewer";
import { useState } from 'react';
import Grid from '@mui/material/Grid2';
import {
    Button,
    FormControl,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import { GenerateFullTitle } from "../utilities/generators";

export default function MainScreen() {

    const defaultRecord = {
        "activity": "arrive",
        "servant": "",
        "absence_type": "",
        "date_start": "",
        "date_end": "",
        "day_count": 0,
        "single_day": false,
        "until_order": false,
        "destination": "",
        "reason": "",
        "certificate": "",
        "certificate_issue_date": "",
        "with_ration_certificate": false,
        "ration_certificate": "",
        "ration_certificate_issue_date": ""
    };

    const [ record, setRecord ] = useState(defaultRecord);

    const [pull, setPull] = useState([]);

    const absence_types = require("../dictionaries/absence_types.json");

    const handleChange = event => setRecord({...record, [event.target.name]: event.target.value })

    const onSubmit = () => {
        setPull([ ...pull, record ]);
        setRecord(defaultRecord)
    }

    const generateDirective = () => {}

    console.log("RENDER ", {record, pull})

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container spacing={24}>
                <FormControl>
                    <RadioGroup
                        row
                        name="activity"
                        value={ record.activity }
                        onChange={ handleChange }
                    >
                        <FormControlLabel value="arrive" control={ <Radio /> } label="Прибуття" />
                        <FormControlLabel value="depart" control={ <Radio /> } label="Вибуття" />
                        <FormControlLabel value="other_points" control={ <Radio /> } label="Інші пункти" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid container>
                <Grid size={6}>
                    {/*<ServantSelection*/}
                    {/*    value={record.servant}*/}
                    {/*    handleChange={ handleChange }*/}
                    {/*/>*/}
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Тип відсутності"
                            name="absence_type"
                            value={ record.absence_type }
                            onChange={handleChange}
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { absence_types.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid container>
                <Grid>
                    <TextField
                        type="date"
                        label="З"
                        name="date_start"
                        value={record.date_start}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                { record.absence_type !== "" && record.activity === "depart" && !["medical_care", "health_circumstances", "medical_board"].includes(record.absence_type) && <>
                    <Grid>
                        <TextField
                            type='number'
                            label="На діб"
                            name="day_count"
                            value={record.day_count}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            type="date"
                            label="ПО"
                            name="date_end"
                            value={record.date_end}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </> }
                { record.absence_type === "mission" && record.activity === "depart" && <Grid>
                    <TextField
                        label="Мета"
                        name="reason"
                        value={record.reason}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid> }
            </Grid>
            { record.absence_type !== "" && !["sick_leave", "health_circumstances"].includes(record.absence_type) &&
                <Grid container>
                    <Grid size={8}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Пункт призначення (в родовому відмінку)"
                            name="destination"
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </Grid>
            }
            <Grid container>
                {record.servant === "" ? "" : GenerateFullTitle(record.servant, "nominative")}
            </Grid>
            <Grid container>
                <Button onClick={ onSubmit }>
                    Додати пункт
                </Button>
                <Button onClick={ generateDirective }>
                    Згенерувати наказ
                </Button>
            </Grid>
            <Grid container>
                {/*<PullViewer pull={ pull }/>*/}
            </Grid>
        </Grid>
    )
}