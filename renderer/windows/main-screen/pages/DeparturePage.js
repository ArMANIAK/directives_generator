import Grid from "@mui/material/Grid2";
import Modal from '@mui/material/Modal';
import { Checkbox, FormControl, FormControlLabel, MenuItem, TextField, Box } from "@mui/material";
import absence_types from "../../../dictionaries/absence_types.json";
import ServantSelector from "../../../components/ServantSelector";
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";
import { useState } from "react";
import { GenerateRankAndName } from "../../../utilities/ServantsGenerators";

const modalStyle = {
    width: "30%",
    position: "absolute",
    top: "30%",
    left: "35%",
    backgroundColor: "white",
    padding: "50px",
}

export default function DeparturePage({
                                        record,
                                        handleChange,
                                        handleCheckBoxChange,
                                        handleDateChange,
                                        handleMultipleValueChange,
                                        addServant,
                                        deleteServant,
                                        absentServants
                                    }) {

    const [ isDepartAbsentWarningOpen, setDepartWarningState ] = useState(false);
    const [ currentServantState, setCurrentServantState]  = useState("");

    const handleCloseWarning = event => {
        setDepartWarningState(false);
        setCurrentServantState("");
    }

    let certificateLabel = '';
    let reasonLabel = '';

    switch (record.absence_type) {
        case 'mission':
            certificateLabel = "Посвідчення про відрядження №";
            reasonLabel = "Підстава для відрядження"
            break;
        case 'sick_leave':
        case 'health_circumstances':
            certificateLabel = "Довідка №";
            reasonLabel = "Вхідний номер та дата рапорта/заяви"
            break;
        case 'medical_care':
        case 'medical_board':
            certificateLabel = "Направлення №";
            reasonLabel = "Вхідний номер та дата рапорта/заяви"
            break;
        case 'vacation':
        case 'family_circumstances':
            certificateLabel = "Відпускний квиток №";
            reasonLabel = "Вхідний номер та дата рапорта/заяви"
            break;
    }

    const handleAbsenceTypeChange = event => {
        if (["medical_care", "health_circumstances", "medical_board"].includes(event.target.value)) {
            const day_count = { target: { name: "day_count", value: "" }}
            const planned_date_end = { target: { name: "planned_date_end", value: "" }}
            handleChange(day_count)
            handleChange(planned_date_end)
        }
        handleChange(event)
    }

    const handleServantSelectorChange = ind => event => {
        let id = event.target.value
        handleMultipleValueChange(ind)(event)
        let currentDuties = absentServants.filter(el => el.servant_id === id);
        if (currentDuties.length > 0) {
            setDepartWarningState(true)
            let message = currentDuties.reduce((text, el) => {
                text += `${GenerateRankAndName(el.servant_id, "nominative")} тимчасово відсутній.` + "\n" +
                    `Тип зайнятості: ${absence_types.find(absence => absence.value === el.absence_type)?.label}.` + "\n";
                if (el.destination) text += `Вибув до ${el.destination}\n`;
                if (el.planned_date_end)text += `Запланована дата повернення ${el.planned_date_end}\n`
                return text;
            }, "");
            setCurrentServantState(message)
        }
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
                            onChange={ handleAbsenceTypeChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        >
                            { absence_types.map(el => <MenuItem key={el.value} value={el.value}>{el.label}</MenuItem>) }
                        </TextField>
                    </FormControl>
                </Grid>
                <Grid size={5}>
                    { ["mission", "medical_care"].includes(record.absence_type) &&
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
                { !["sick_leave", "health_circumstances"].includes(record.absence_type) &&
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
                { record.absence_type === "mission" &&
                    <Grid size={5}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Мета"
                            name="purpose"
                            value={record.purpose}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid> }
            </Grid>
            <Grid container>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="З"
                        name="date_start"
                        value={record.date_start}
                        onChange={ handleDateChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                { !["medical_care", "health_circumstances", "medical_board"].includes(record.absence_type) && <>
                    <Grid size={2}>
                        <TextField
                            type='number'
                            label="На діб"
                            name="day_count"
                            disabled={ record.single_day || record.until_order }
                            value={ record.day_count || ""}
                            onChange={ handleDateChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                    <Grid size={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="ПО"
                            name="planned_date_end"
                            disabled={record.single_day || record.until_order}
                            value={record.planned_date_end}
                            onChange={ handleDateChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </> }
                { ['health_circumstances', 'vacation', 'family_circumstances'].includes(record.absence_type) &&
                    <Grid size={2}>
                        <TextField
                            type='number'
                            label="Доби на дорогу"
                            name="trip_days"
                            value={ record.trip_days || ""}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                }
                { record.absence_type === "mission" &&
                    <>
                        <Grid size={2}>
                            <FormControlLabel
                                control={ <Checkbox
                                    name="single_day"
                                    checked={record.single_day}
                                /> }
                                label="На одну добу"
                                onChange={ handleCheckBoxChange }
                            />
                        </Grid>
                        <Grid size={2}>
                            <FormControlLabel
                                control={ <Checkbox
                                    name="until_order"
                                    checked={record.until_order}
                                /> }
                                label="До окремого розпорядження"
                                onChange={ handleCheckBoxChange }
                            />
                        </Grid>
                    </>}
            </Grid>
            { Array.isArray(record.servants) && record.servants.map((el, ind) => {
                return (
                    <Grid direction={'column'} container spacing={2} key={`servant-selector-${ind}`}>
                        <Grid container spacing={4} alignItems="center" >
                            <Grid size={6}>
                                <ServantSelector
                                    value={el}
                                    handleChange={ handleServantSelectorChange(ind) }
                                    absentServants={ absentServants }
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
                                    label={ certificateLabel }
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
                <Grid size={5}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label={ reasonLabel }
                        placeholder={record.absence_type === "mission"
                            ? "розпорядження НГШ № ххх від 01.01.2025"
                            : "12-12342 від 01.01.2025" }
                        name="reason"
                        value={record.reason}
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>

            <Modal
                open={ isDepartAbsentWarningOpen }
                onClose={ handleCloseWarning }
            >
                <Box style={modalStyle}>
                    { currentServantState }
                </Box>
            </Modal>
        </Grid>
        )
}