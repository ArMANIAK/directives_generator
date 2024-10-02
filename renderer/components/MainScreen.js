"use client";

import ServantSelector from "../components/ServantSelector";
import PullViewer from "../components/PullViewer";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Grid from '@mui/material/Grid2';
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField
} from "@mui/material";
import {  GenerateFullTitle } from "../utilities/ServantsGenerators";
import { GenerateOrder } from "../utilities/OrderGenerator";
import { DateToDatepickerString, dateMath } from "../utilities/DateFormatters";
import { setTitles, setDepartments, setServants } from "../store/dictionarySlice"
import { IoIosAddCircleOutline, IoIosTrash } from "react-icons/io";

export default function MainScreen() {

    const dispatch = useDispatch();
    const [servants, setServantsState ] = useState([])

    useEffect(() => {
        if (typeof window !== 'undefined' && window.electron) {
            const ipcRenderer = window.electron.ipcRenderer;

            ipcRenderer.invoke('get-dict').then((result) => {
                dispatch(setTitles(result.titles))
                dispatch(setDepartments(result.departments))
                dispatch(setServants(result.servants))
                setServantsState(result.servants)
            }).catch((err) => {
                console.error('Error fetching dictionary:', err);
            });
        }
    }, []);

    const defaultRecord = {
        "orderSection": "arrive",
        "servants": [""],
        "absence_type": "mission",
        "date_start": "",
        "date_end": "",
        "day_count": 0,
        "single_day": false,
        "until_order": false,
        "destination": "",
        "purpose": "",
        "reason": "",
        "certificate": [""],
        "certificate_issue_date": [""],
        "with_ration_certificate": false,
        "ration_certificate": "",
        "ration_certificate_issue_date": ""
    };

    const [ record, setRecord ] = useState(defaultRecord);

    const [pull, setPull] = useState([]);

    const absence_types = require("../dictionaries/absence_types.json");

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

    const handleChange = event => setRecord({...record, [event.target.name]: event.target.value })

    const handleCheckBoxChange = event => {
        const { target: { name, checked } } = event;
        console.log(name, checked)
        const changedRecord = {
            ... record,
            [name]: checked,
        }
        switch (name) {
            case "single_day":
                if (checked) {
                    changedRecord.day_count = 1;
                    changedRecord.date_end = changedRecord.date_start;
                    changedRecord.until_order = false;
                }
                setRecord(changedRecord)
                break;
            case "until_order":
                setRecord({
                    ...changedRecord,
                    day_count: 0,
                    date_end: "",
                    single_day: false
                })
                break;
            default:
                setRecord(changedRecord)
        }
    }

    const handleDateChange = event => {
        const { name, value } = event.target;
        let { date_start, day_count, date_end } = record;
        switch (name) {
            case "date_start": {
                date_start = value;
                if (day_count) {
                    let dateEnd = dateMath(date_start, day_count);
                    date_end = DateToDatepickerString(dateEnd);
                }
                break;
            }
            case "day_count": {
                day_count = value;
                if (date_start !== "") {
                    let dateEnd = dateMath(date_start, day_count);
                    date_end = DateToDatepickerString(dateEnd);
                }
                break;
            }
            case "date_end": {
                date_end = value;
                if (day_count) {
                    let dateStart = dateMath(date_end, day_count, "subtract");
                    date_start = DateToDatepickerString(dateStart);
                }
                break;
            }
            default:
                break;
        }
        setRecord({ ...record, date_end, day_count, date_start })
    }

    const handleMultipleValueChange = ind => event => {
        const newRecord = { ...record }
        newRecord[event.target.name][ind] = event.target.value;
        setRecord(newRecord)
    }

    const addServant = () => {
        setRecord({
            ...record,
            servants:               [ ...record.servants, "" ],
            certificate:            [ ...record.certificate, "" ],
            certificate_issue_date: [ ...record.certificate_issue_date, "" ],
        })
    }

    const deleteServant = index => () => {
        setRecord({
            ...record,
            servants:                   [ ...record.servants.splice(index, 1) ],
            certificate:                [ ...record.certificate.splice(index, 1) ],
            certificate_issue_date:     [ ...record.certificate_issue_date.splice(index, 1) ],
        });
    }

    const onSubmit = () => {
        let records = record.servants.map((el, ind) => {
            return {
                ...record,
                servants:                   el,
                certificate:                record.certificate[ind],
                certificate_issue_date:     record.certificate_issue_date[ind]
            }
        })
        setPull([ ...pull, ...records]);
        setRecord(defaultRecord)
    }

    const generateDirective = () => {
        console.log(pull)
        let text = GenerateOrder(pull);
        console.dir(text)
        window.electron.sendToClipboard(text);
    }

    console.log(record)

    return (
        <Grid direction={'column'} container spacing={2}>
            <Grid container spacing={8}>
                <Grid>
                    <FormControl>
                        <RadioGroup
                            row
                            name="orderSection"
                            value={ record.orderSection }
                            onChange={ handleChange }
                        >
                            <FormControlLabel value="arrive" control={ <Radio /> } label="Прибуття" />
                            <FormControlLabel value="depart" control={ <Radio /> } label="Вибуття" />
                            <FormControlLabel value="other_points" control={ <Radio /> } label="Інші пункти" />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
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
                { record.absence_type !== "" && !["sick_leave", "health_circumstances"].includes(record.absence_type) &&
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
                { record.absence_type === "mission" && record.orderSection === "depart" &&
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
                { record.absence_type !== "" && record.orderSection === "depart" && !["medical_care", "health_circumstances", "medical_board"].includes(record.absence_type) && <>
                    <Grid size={2}>
                        <TextField
                            type='number'
                            label="На діб"
                            name="day_count"
                            disabled={ record.single_day || record.until_order }
                            value={ record.day_count }
                            onChange={ handleDateChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                    <Grid size={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="ПО"
                            name="date_end"
                            disabled={record.single_day || record.until_order}
                            value={record.date_end}
                            onChange={ handleDateChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                </> }
                { record.orderSection === 'depart' && record.absence_type === "mission" &&
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
                                    handleChange={ handleMultipleValueChange(ind) }
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
                                    color={ record.servants.length > 1 ? "black" : "lightgray" }
                                    size={30}
                                    onClick={record.servants.length > 1 ? deleteServant(ind) : null}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            { record.absence_type !== "" &&
                                <>
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
                                </>
                        }
                        </Grid>
                    </Grid>
                )
            })}
            <Grid container>
                { record.absence_type === "mission" && record.orderSection === "depart" &&
                    <Grid size={5}>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Підстава"
                            name="reason"
                            value={record.reason}
                            onChange={ handleChange }
                            slotProps={ { inputLabel: { shrink: true } } }
                        />
                    </Grid>
                }

            </Grid>
            <Grid container>
                { record.absence_type !== "" && record.with_ration_certificate &&
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
            <Grid container>
                {!record.servant ? "" : GenerateFullTitle(record.servant.id, "nominative")}
            </Grid>
            <Grid container>
                <Button onClick={ onSubmit }>
                    Додати пункт
                </Button>
                <Button onClick={ generateDirective }>
                    Згенерувати наказ
                </Button>
            </Grid>
            <Grid container>
                <PullViewer pull={ pull }/>
            </Grid>
        </Grid>
    )
}