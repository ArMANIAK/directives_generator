import Grid from "@mui/material/Grid2";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";
import {Checkbox, FormControl, FormControlLabel, MenuItem, Radio, RadioGroup, TextField} from "@mui/material";

export default function StateSecretPage({ record, handleOtherPointChange, handleMultipleValueChange,addServant, deleteServant }) {

    const stateSecretFormList = [
        {
            label: "Форма 1 (особливої важливості)",
            value: "form_1"
        },
        {
            label: "Форма 2 (цілком таємно)",
            value: "form_2"
        },
        {
            label: "Форма 3 (таємно)",
            value: "form_3"
        },
    ];

    const mobilizationDocumentsAccess = [
        {
            label: "Без доступу до мобілізаційної роботи",
            value: "none"
        },
        {
            label: "Доступ в межах займаної посади",
            value: "limited"
        },
        {
            label: "Повний доступ до мобілізаційної роботи",
            value: "full_access"
        },
    ];

    const handleChange = event => {
        const { name, value, checked } = event.target;
        const newSettings = {
            ...record.settings,
            [name]: name === "payed" ? checked : value
        }
        handleOtherPointChange({ ...record, settings: { ...newSettings } })
    }

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container spacing={12}>
                <Grid container>
                    <FormControl>
                        <RadioGroup
                            row
                            name="state_secret_access"
                            value={ record.settings.state_secret_access || "" }
                            onChange={ handleChange }
                        >
                            <FormControlLabel value="grant" control={ <Radio /> } label="Надання доступу" />
                            <FormControlLabel value="reject" control={ <Radio /> } label="Припинення доступу" />
                        </RadioGroup>
                    </FormControl>
                    <FormControlLabel
                        control={ <Checkbox
                            name="payed"
                            checked={ record.settings.payed || false }
                        /> }
                        label="З доплатою"
                        onChange={ handleChange }
                    />
                </Grid>
            </Grid>
            <Grid container>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Форма допуску"
                            name="state_secret"
                            value={ record.settings.state_secret || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { stateSecretFormList.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid size={6}>
                    <FormControl fullWidth>
                        <TextField
                            select
                            label="Доступ до мобілізаційної роботи"
                            name="mobilization_access"
                            value={ record.settings.mobilization_access || "" }
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { mobilizationDocumentsAccess.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
            </Grid>
            { Array.isArray(record.servants) && record.servants.map((el, ind) => {
                return (
                    <Grid direction={'column'} container spacing={2} key={`servant-selector-${ind}`}>
                        <Grid container spacing={4} alignItems="center" >
                            <Grid size={6}>
                                <ServantSelector
                                    value={el}
                                    handleChange={ handleMultipleValueChange(ind) }
                                />
                            </Grid>
                            <Grid size={1}>
                                <IoIosAddCircleOutline
                                    size={30}
                                    onClick={ addServant }
                                />
                            </Grid>
                            <Grid size={1}>
                                <IoIosTrash
                                    size={30}
                                    color={ record.servants.length > 1 ? "black" : "lightgray" }
                                    onClick={record.servants.length > 1 ? deleteServant(ind) : null}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Рапорт на надання/припинення доступу"
                        name="prescription_no"
                        value={ record.settings.prescription_no || "" }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}

