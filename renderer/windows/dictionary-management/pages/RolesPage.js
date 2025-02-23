import Grid from "@mui/material/Grid2";
import { TextField, Button } from "@mui/material";
import { useState } from "react";
import DictionaryViewer from "../../../components/DictionaryViewer";
import { ROLES_VAR } from "../../../dictionaries/constants";

export default function RolesPage({ saveRecord, removeRecord }) {

    const initState = {
        id: undefined,
        name_nominative: "",
        name_dative: "",
        name_accusative: ""
    }

    const [ role, setRole ] = useState(initState);

    const handleChange = event => {
        let updated = { ...role, [event.target.name]: event.target.value };
        setRole(updated);
    }

    const handleSubmit = () => {
        let updatedRecord = { ... role }
        saveRecord(updatedRecord)
        setRole(initState)
    }

    const editRecord = record => {
        setRole({ ...record })
    }

    const headers = [
        {
            label: "Назва ролі",
            value: "name_nominative"
        }
    ]

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в називному відмінку"
                    name="name_nominative"
                    value={ role.name_nominative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в давальному відмінку"
                    name="name_dative"
                    value={ role.name_dative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в знахідному відмінку"
                    name="name_accusative"
                    value={ role.name_accusative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <Button
                    variant="contained"
                    onClick={ handleSubmit }>
                    Зберегти роль
                </Button>
            </Grid>
            <DictionaryViewer
                dictionaryType={ ROLES_VAR }
                editRecord={ editRecord }
                removeRecord={ removeRecord }
                headers={ headers }
            />
        </Grid>
    )
}