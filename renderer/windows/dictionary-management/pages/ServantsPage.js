import Grid from "@mui/material/Grid2";
import { TextField, Checkbox, FormControlLabel } from "@mui/material";
import { GenerateFullTitle } from "../../../utilities/ServantsGenerators";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";

export default function ServantsPage({ record, handleChange }) {

    const ranks = require("../../../dictionaries/ranks.json");
    const ranksList = ranks.map(el => ({ label: el.name_nominative, value: el.id }))

    const titles = useSelector(state => state.dictionaries.titles);
    const titlesList = titles.map(el => ({
        label: `${el.title_index} - ${GenerateFullTitle(el, "nominative")}`,
        value: el.title_index
    }))

    const handleCheckBoxChange = event => {
        const { target: { name, checked } } = event;
        const updatedEvent = {
            target: {
                name,
                value: checked ? "так" : "ні"
            }
        }
        handleChange(updatedEvent);
    }

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в називному відмінку"
                        name="first_name_nominative"
                        placeholder="Ігор Петрович"
                        value={ record.first_name_nominative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в родовому відмінку"
                        name="first_name_genitive"
                        placeholder="Ігоря Петровича"
                        value={ record.first_name_genitive || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в давальному відмінку"
                        name="first_name_dative"
                        placeholder="Ігорю Петровичу"
                        value={ record.first_name_dative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в знахідному відмінку"
                        name="first_name_accusative"
                        placeholder="Ігоря Петровича"
                        value={ record.first_name_accusative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Імʼя та по батькові в орудному відмінку"
                        name="first_name_instrumental"
                        placeholder="Ігорем Петровичем"
                        value={ record.first_name_instrumental || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Ініціали"
                        name="first_name_short"
                        placeholder="І.П."
                        value={ record.first_name_short || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в називному відмінку"
                        name="last_name_nominative"
                        placeholder="ТІТІКАКА"
                        value={ record.last_name_nominative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в родовому відмінку"
                        name="last_name_genitive"
                        placeholder="ТІТІКАКИ"
                        value={ record.last_name_genitive || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в давальному відмінку"
                        name="last_name_dative"
                        placeholder="ТІТІКАЦІ"
                        value={ record.last_name_dative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в знахідному відмінку"
                        name="last_name_accusative"
                        placeholder="ТІТІКАКУ"
                        value={ record.last_name_accusative || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Прізвище в орудному відмінку"
                        name="last_name_instrumental"
                        placeholder="ТІТІКАКОЮ"
                        value={ record.last_name_instrumental || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={2}>
                    <TextField
                        fullWidth
                        label="Стать"
                        name="gender"
                        placeholder="ж / ч"
                        value={ record.gender || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Військове звання / працівник ЗСУ"
                        list={ ranksList }
                        name="rank"
                        value={ record.rank || ""}
                    />
                </Grid>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Спеціальне звання в родовому відмінку"
                        placeholder="медичної служби, юстиції, тощо"
                        name="speciality"
                        value={ record.speciality || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={8}>
                    <TextField
                        fullWidth
                        label="На котловому забезпеченні при..."
                        name="supplied_by"
                        placeholder="військовій частині А0232"
                        value={ record.supplied_by || ""}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3} offset={1}>
                    <FormControlLabel
                        control={ <Checkbox
                            name="retired"
                            checked={ (record.retired === "так") }
                        /> }
                        label="Звільнено / переведено"
                        onChange={ handleCheckBoxChange }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={8}>
                    <Selector
                        fullWidth
                        handleChange={ handleChange }
                        label="Індекс поточної посади"
                        list={ titlesList }
                        name="title_index"
                        value={ record.title_index || ""}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}