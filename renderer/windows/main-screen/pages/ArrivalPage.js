import Grid from "@mui/material/Grid2";
import {Checkbox, FormControl, FormControlLabel, MenuItem, TextField} from "@mui/material";
import absence_types from "../../../dictionaries/absence_types.json";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";

export default function ArrivalPage({
                                        record,
                                        handleChange,
                                        handleCheckBoxChange,
                                        handleMultipleValueChange,
                                        addServant,
                                        deleteServant
                                    }) {

    let reasonLabel = '';

    switch (record.absence_type) {
        case 'mission':
            reasonLabel = "Посвідчення про відрядження №";
            break;
        case 'sick_leave':
        case 'health_circumstances':
            reasonLabel = "Довідка №";
            break;
        case 'medical_care':
        case 'medical_board':
            reasonLabel = "Направлення №";
            break;
        case 'vacation':
        case 'family_circumstances':
            reasonLabel = "Відпускний квиток №";
            break;
    }

    const handleServantSelectorChange = id => event => {
        handleMultipleValueChange(id)(event)
    }

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container>
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
                <Grid size={5}>
                    { record.orderSection !== 'other_points' && ["mission", "medical_care"].includes(record.absence_type) &&
                        <FormControlLabel
                            control={ <Checkbox
                                name="with_ration_certificate"
                                checked={record.with_ration_certificate}
                            /> }
                            label="з продовольчим атестатом"
                            onChange={ handleCheckBoxChange }
                        />
                    }
                </Grid>
            </Grid>
            <Grid container>
                { !["sick_leave", "health_circumstances", "vacation", "family_circumstances"].includes(record.absence_type) &&
                    <Grid size={7}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Пункт призначення (в родовому відмінку)"
                            name="destination"
                            value={record.destination}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                }
            </Grid>
            <Grid container>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Повернувся(-лася)"
                        name="fact_date_end"
                        value={record.fact_date_end}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            { Array.isArray(record.servants) && record.servants.map((el, ind) => {
                return (
                    <Grid direction={'column'} container spacing={2} key={`servant-selector-${ind}`}>
                        <Grid container spacing={4} alignItems="center" >
                            <Grid size={6}>
                                <ServantSelector
                                    value={el}
                                    handleChange={ handleServantSelectorChange(ind) }
                                />
                            </Grid>
                            <Grid size={1}>
                                <IoIosAddCircleOutline
                                    size={30}
                                    onClick={addServant}
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
                        <Grid container>
                            <Grid size={5}>
                                <TextField
                                    fullWidth
                                    label={ reasonLabel }
                                    name="certificate"
                                    value={record.certificate[ind]}
                                    onChange={ handleMultipleValueChange(ind) }
                                    slotProps={ { inputLabel: { shrink: true } } }
                                />
                            </Grid>
                            <Grid size={3}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="від"
                                    name="certificate_issue_date"
                                    value={record.certificate_issue_date[ind]}
                                    onChange={ handleMultipleValueChange(ind) }
                                    slotProps={ { inputLabel: { shrink: true } } }
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
            <Grid container>
                { record.with_ration_certificate &&
                    <>
                        <Grid size={5}>
                            <TextField
                                fullWidth
                                label="Продовольчий атестат"
                                name="ration_certificate"
                                value={record.ration_certificate}
                                onChange={ handleChange }
                                slotProps={ { inputLabel: { shrink: true } } }
                            />
                        </Grid>
                        <Grid size={3}>
                            <TextField
                                fullWidth
                                type="date"
                                label="від"
                                name="ration_certificate_issue_date"
                                value={record.ration_certificate_issue_date}
                                onChange={ handleChange }
                                slotProps={ { inputLabel: { shrink: true } } }
                            />
                        </Grid>
                    </>
                }
            </Grid>
        </Grid>
        )
}