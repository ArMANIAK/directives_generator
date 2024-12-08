"use client";

import PullViewer from "../../components/PullViewer";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import Grid from '@mui/material/Grid2';
import {
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup, TextField
} from "@mui/material";
import {  GenerateFullTitle } from "../../utilities/ServantsGenerators";
import { GenerateOrder } from "../../utilities/OrderGenerator";
import {
    dateToDatepickerString,
    dateMath,
    dateStringCompare,
    datePickerToDateString,
    getDateDifference
} from "../../utilities/DateUtilities";
import {convertPullToTempBook, convertTempBookToPull} from "../../utilities/PullToTempBookConverter"
import {
    setTitles,
    setDepartments,
    setServants,
    setRecord,
    resetRecord,
    setRecordArray,
    addServantRecord,
    deleteServantRecord,
    addRow,
    clearTempBookRecords
} from "../../store"
import ArrivalPage from "./pages/ArrivalPage";
import DeparturePage from "./pages/DeparturePage";

export default function MainScreen() {

    const dispatch = useDispatch();
    const record = useSelector(state => state.record)
    const pull = useSelector(state => state.pull)
    const [servants, setServantsState ] = useState([])
    const [ tempBook, setTempBook ] = useState([]);

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


            ipcRenderer.invoke('get-temp-book').then((result) => {
                console.log("ТИМЧАСОВКА", result)
                setTempBook(result)
            }).catch((err) => {
                console.error('Error fetching temporal book:', err);
            });
        }
    }, []);

    useEffect(() => {
        dispatch(clearTempBookRecords())
        console.log(tempBook)
        generateAutoPull()
    }, [ record.order_no, record.order_date ])

    const generateAutoPull = () => {
        let autoPull = tempBook.reduce((acc, el, index) => {
            if (el.depart_order_no == record.order_no
                || el.arrive_order_no == record.order_no
                || !el.arrive_order_no && dateStringCompare(datePickerToDateString(el.planned_date_end), record.order_date) === -1) {
                let row = convertTempBookToPull(el);
                row.id = index;
                row.order_no = record.order_no;
                row.order_date = record.order_date;
                row.orderSection = el.depart_order_no == record.order_no ? "depart" : "arrive";
                if (row.orderSection && !row.fact_date_end) {
                    if (dateStringCompare(row.planned_date_end, record.order_date) < 0)
                        row.fact_date_end = row.planned_date_end
                    else row.fact_date_end = row.order_date
                }
                acc.push(row);
            }
            return acc;
        }, [])
        if (autoPull.length > 0)
            dispatch(addRow(autoPull))
    }

    const handleChange = event => dispatch(setRecord({ [event.target.name]: event.target.value }))

    const handleCheckBoxChange = event => {
        const { target: { name, checked } } = event;
        const changedValues = {
            [name]: checked,
        }
        switch (name) {
            case "single_day":
                if (checked) {
                    changedValues.day_count = 1;
                    changedValues.planned_date_end = changedValues.date_start;
                    changedValues.until_order = false;
                }
                dispatch(setRecord(changedValues))
                break;
            case "until_order":
                dispatch(setRecord({
                    day_count: 0,
                    planned_date_end: "",
                    single_day: false
                }))
                break;
            default:
                dispatch(setRecord(changedValues))
        }
    }

    const handleDateChange = event => {
        const { name, value } = event.target;
        let { date_start, day_count, planned_date_end } = record;
        switch (name) {
            case "date_start": {
                date_start = value;
                if (day_count) {
                    let dateEnd = dateMath(date_start, day_count - 1);
                    planned_date_end = dateToDatepickerString(dateEnd);
                }
                break;
            }
            case "day_count": {
                day_count = value;
                let dateEnd = dateMath(date_start, day_count - 1);
                planned_date_end = dateToDatepickerString(dateEnd);
                break;
            }
            case "planned_date_end": {
                planned_date_end = value;
                if (date_start) {
                    day_count = getDateDifference(new Date(date_start), new Date(planned_date_end))
                }
                else if (day_count) {
                    let dateStart = dateMath(planned_date_end, day_count - 1, "subtract");
                    date_start = dateToDatepickerString(dateStart);
                }
                break;
            }
            default:
                break;
        }
        dispatch(setRecord({ planned_date_end, day_count, date_start }))
    }

    const handleMultipleValueChange = ind => event => {
        dispatch(setRecordArray({
            field: event.target.name,
            index: ind,
            value: event.target.value
        }))
    }

    const addServant = () => {
        dispatch(addServantRecord())
    }

    const deleteServant = index => () => {
        dispatch(deleteServantRecord(index));
    }

    const onSubmit = () => {
        let records = record.servants.map((el, ind) => {
            return {
                ...record,
                servant_id:                   el,
                certificate:                record.certificate[ind],
                certificate_issue_date:     record.certificate_issue_date[ind]
            }
        })
        dispatch(addRow(records));
        dispatch(resetRecord())
    }

    const SaveClauses = () => {
        const updatedTempBook = [ ...tempBook ];
        pull.forEach(el => {
            const tempBookRecordUpdates = convertPullToTempBook(el)
            if (el.id || el.id === 0)
                updatedTempBook[el.id] = { ...tempBook[el.id], ...tempBookRecordUpdates }
            else updatedTempBook.push(tempBookRecordUpdates)
        })
        setTempBook(updatedTempBook);
        const ipcRenderer = window.electron.ipcRenderer;
        ipcRenderer.invoke('save-temp-book', updatedTempBook).then((result) => {
            setTempBook(result)
        }).catch((err) => {
            console.error('Error saving temporal book:', err);
        });
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
                        value={ record.order_no }
                        onChange={ handleChange }
                        slotProps={ { inputLabel: { shrink: true } } }
                    />
                </Grid>
                <Grid size={3}>
                    <TextField
                        fullWidth
                        type="date"
                        label="Наказ від"
                        name="order_date"
                        value={ record.order_date }
                        onChange={ handleChange }
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
                <Button onClick={ SaveClauses }>
                    Зберегти пункти
                </Button>
                <Button onClick={ generateDirective }>
                    Згенерувати наказ
                </Button>
            </Grid>
            <Grid container>
                <PullViewer />
            </Grid>
        </Grid>
    )
}