"use client";

import ServantSelection from "@/components/servant_selection";
import { useState } from 'react';
import { GenerateFullTitle } from "@/utilities/generators";
import Grid from '@mui/material/Grid2';
import {FormControl, FormControlLabel, Radio, RadioGroup} from "@mui/material";

export default function MainScreen() {
    const [servant, setServant] = useState('')
    // const handleSelect = event => setServant(GenerateFullTitle(event.target.value))

    return (
        <>
            <Grid>
                <FormControl>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="arrival"
                        name="radio-buttons-group"
                    >
                        <FormControlLabel value="arrival" control={<Radio />} label="Прибуття" />
                        <FormControlLabel value="depart" control={<Radio />} label="Вибуття" />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid container>
                <Grid size={8}>
                    <ServantSelection />
                </Grid>
            </Grid>
            <Grid>
                <h3>{ servant }</h3>
            </Grid>
        </>
    )
}