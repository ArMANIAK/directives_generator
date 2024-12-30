import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { TITLES_VAR } from "../../../dictionaries/constants";

export default function TitlesPage({ saveRecord, removeRecord }) {

    const initState = {
        id: undefined,
        name_nominative: "",
        name_dative: "",
        name_accusative: ""
    }

    const [ title, setTitle ] = useState(initState);

    const handleChange = event => {
        let updated = { ...title, [event.target.name]: event.target.value };
        setTitle(updated);
    }

    const handleSubmit = () => {
        let updatedRecord = { ... title }
        saveRecord(updatedRecord)
        setTitle(initState)
    }

    const editRecord = record => {
        setTitle({ ...record })
    }

    const headers = [
        {
            label: "Назва посади",
            value: "name_nominative"
        }
    ]

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в називному відмінку"
                    name="name_nominative"
                    value={ title.name_nominative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в давальному відмінку"
                    name="name_dative"
                    value={ title.name_dative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в знахідному відмінку"
                    name="name_accusative"
                    value={ title.name_accusative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={ handleSubmit }>
                    Зберегти посаду
                </Button>
            </Grid>
            <DictionaryViewer
                dictionaryType={ TITLES_VAR }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers }
            />
        </Grid>
    )
}