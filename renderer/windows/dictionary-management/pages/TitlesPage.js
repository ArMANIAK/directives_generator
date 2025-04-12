import Grid from "@mui/material/Grid2";
import { TextField, Typography } from "@mui/material";
import Selector from "../../../components/Selector";
import { useSelector } from "react-redux";
import { GenerateFullTitle } from "../../../utilities/ServantsGenerators";

export default function TitlesPage({ record, handleChange }) {

    const roles = useSelector(state => state.dictionaries.roles);
    const rolesList = roles.map(el => ({ label: el.name_nominative, value: el.id }))

    const departments = useSelector(state => state.dictionaries.departments);
    const departmentsList = departments.map(el => ({ label: el.name_nominative, value: el.id }))

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid size={5}>
                <TextField
                    fullWidth
                    label="Індекс посади"
                    name="title_index"
                    value={ record.title_index }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Первинна роль"
                        list={ rolesList }
                        name="primary_role"
                        value={ record.primary_role }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ первинної ролі"
                        list={ departmentsList }
                        name="primary_department"
                        value={ record.primary_department }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Вторинна роль"
                        list={ rolesList }
                        name="secondary_role"
                        value={ record.secondary_role }
                    />
                </Grid>
                <Grid size={5}>
                    <Selector
                        handleChange={ handleChange }
                        label="Підрозділ вторинної ролі"
                        list={ departmentsList }
                        name="secondary_department"
                        value={ record.secondary_department }
                    />
                </Grid>
            </Grid>
            <Grid>
                <Typography><strong>ПОСАДА: </strong>{ GenerateFullTitle(record, "nominative") }</Typography>
            </Grid>
        </Grid>
    )
}