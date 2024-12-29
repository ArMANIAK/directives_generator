import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import {useState} from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { TITLES_VAR } from "../../../dictionaries/constants";

export default function TitlesPage({ saveRecord, removeRecord }) {

    const initState = {
        id: undefined,
        nameNominative: "",
        nameDative: "",
        nameAccusative: ""
    }

    const [ title, setTitle ] = useState(initState);

    const handleChange = event => {
        let updated = { ...title, [event.target.name]: event.target.value };
        setTitle(updated);
    }

    const handleSubmit = () => {
        let updatedRecord = {
            id: title.id,
            name_nominative: title.nameNominative,
            name_dative: title.nameDative,
            name_accusative: title.nameAccusative
        }
        saveRecord(updatedRecord)
        setTitle(initState)
    }

    const editRecord = record => {
        setTitle({
            id: record.id,
            nameNominative: record.name_nominative,
            nameDative: record.name_dative,
            nameAccusative: record.name_accusative
        })
    }

    const headers = [ { label: "Назва посади", value: "name_nominative" } ]

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в називному відмінку"
                    name="nameNominative"
                    value={ title.nameNominative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в давальному відмінку"
                    name="nameDative"
                    value={ title.nameDative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва посади в знахідному відмінку"
                    name="nameAccusative"
                    value={ title.nameAccusative }
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