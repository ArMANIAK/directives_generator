import Grid from "@mui/material/Grid2";
import { TextField } from "@mui/material";

export default function RolesPage({ record, handleChange }) {

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в називному відмінку"
                    name="name_nominative"
                    placeholder="водій"
                    value={ record.name_nominative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в давальному відмінку"
                    name="name_dative"
                    placeholder="водію"
                    value={ record.name_dative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в знахідному відмінку"
                    name="name_accusative"
                    placeholder="водія"
                    value={ record.name_accusative }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
            <Grid>
                <TextField
                    fullWidth
                    label="Назва ролі в орудному відмінку"
                    name="name_instrumental"
                    placeholder="водієм"
                    value={ record.name_instrumental }
                    onChange={ handleChange }
                    slotProps={ { inputLabel: { shrink: true } } }
                />
            </Grid>
        </Grid>
    )
}