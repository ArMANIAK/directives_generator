"use client";

import PullViewer from "../components/PullViewer";
import { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import Grid from '@mui/material/Grid2';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, TextField
} from "@mui/material";
import {  GenerateFullTitle } from "../utilities/ServantsGenerators";
import { GenerateOrder } from "../utilities/OrderGenerator";
import { DateToDatepickerString, DateMath } from "../utilities/DateUtilities";
import { setTitles, setDepartments, setServants } from "../store/dictionarySlice"
import ArrivalPage from "./ArrivalPage";
import DeparturePage from "./DeparturePage";

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

    const [ order_no, setOrderNo ] = useState();

    const [ order_date, setOrderDate ] = useState(DateToDatepickerString(new Date()))

    const defaultRecord = {
        "orderSection": "arrive",
        "servants": [""],
        "absence_type": "mission",
        "date_start": DateToDatepickerString(new Date()),
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

    const handleChange = event => setRecord(record =>  ({ ...record, [event.target.name]: event.target.value }))

    const handleCheckBoxChange = event => {
        const { target: { name, checked } } = event;
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
                    let dateEnd = DateMath(date_start, day_count - 1);
                    date_end = DateToDatepickerString(dateEnd);
                }
                break;
            }
            case "day_count": {
                day_count = value;
                let dateEnd = DateMath(date_start, day_count - 1);
                date_end = DateToDatepickerString(dateEnd);
                break;
            }
            case "date_end": {
                date_end = value;
                if (day_count) {
                    let dateStart = DateMath(date_end, day_count - 1, "subtract");
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
            <Grid container>
                <Grid size={5}>
                    <TextField
                        fullWidth
                        label="Номер наказу"
                        name="order_no"
                        value={order_no}
                        onChange={ event => setOrderNo(event.target.value) }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Наказ від"
                        name="order_date"
                        value={order_date}
                        onChange={ event => setOrderDate(event.target.value) }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
            </Grid>
            <Grid container spacing={8}>
                <Grid container>
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
                {!record.servant ? "" : GenerateFullTitle(record.servant.id, "nominative")}
            </Grid>
            { record.orderSection === "arrive" && <ArrivalPage
                record={record}
                handleChange={handleChange}
                handleCheckBoxChange={handleCheckBoxChange}
                handleMultipleValueChange={handleMultipleValueChange}
                handleDateChange={handleDateChange}
                addServant={addServant}
                deleteServant={deleteServant}
            /> }
            { record.orderSection === "depart" && <DeparturePage
                record={record}
                handleChange={handleChange}
                handleCheckBoxChange={handleCheckBoxChange}
                handleMultipleValueChange={handleMultipleValueChange}
                handleDateChange={handleDateChange}
                addServant={addServant}
                deleteServant={deleteServant}
            /> }
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