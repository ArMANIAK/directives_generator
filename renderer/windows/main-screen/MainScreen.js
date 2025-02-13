"use client";

import PullViewer from "../../components/PullViewer";
import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
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
    clearTempBookRecords,
} from "../../store"

import ArrivalPage from "./pages/ArrivalPage";
import DeparturePage from "./pages/DeparturePage";
import OtherPointsPage from "./pages/OtherPointsPage";

export default function MainScreen() {

    const dispatch = useDispatch();
    const record = useSelector(state => state.record)
    const pull = useSelector(state => state.pull, shallowEqual)
    const [ , setServantsState ] = useState([])
    const [ tempBook, setTempBook ] = useState([]);
    const [ absentServants, setAbsentServants ] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.electron) {
            const ipcRenderer = window.electron.ipcRenderer;

            ipcRenderer.invoke('get-dict').then((result) => {
                dispatch(setTitles(result.titles))
                dispatch(setDepartments(result.departments))
                dispatch(setServants(result.servants.filter(el => el.retired !== "так")))
                setServantsState(result.servants)
            }).catch((err) => {
                console.error('Error fetching dictionary:', err);
            });

            ipcRenderer.invoke('get-temp-book').then((result) => {
                console.log("ТИМЧАСОВКА", result);
                setTempBook(result);
                setAbsentServants(result
                    .reduce((acc, el, ind)  => {
                        if (el.arrive_order_no && "" + el.arrive_order_no !== "" + record.order_no) return acc;
                        let rec = convertTempBookToPull(el)
                        rec.id = ind;
                        acc.push(rec);
                        return acc;
                    }, []))
            }).catch((err) => {
                console.error('Error fetching temporal book:', err);
            });
        }
    }, []);

    useEffect(() => {
        dispatch(clearTempBookRecords())
        if (pull.length === 0) generateAutoPull()
    }, [ record.order_no, record.order_date ])

    useEffect(() => {
        generateAutoPull()
    }, [ pull ])

    const shouldReturn = (tempBookRec, order_date) => {
        if (tempBookRec.arrive_order_no || !tempBookRec.planned_date_end) return false;
        if (tempBookRec.absence_type === "mission") return dateStringCompare(tempBookRec.planned_date_end, order_date) === -1;
        let planned_end = dateMath(tempBookRec.planned_date_end, (parseInt(tempBookRec.trip_days) || 0) + 1);
        return dateStringCompare(dateToDatepickerString(planned_end), order_date) < 1;
    }

    const existInPull = record => {
        const sameRecords = pull.filter(el => {
            return el.orderSection === record.orderSection
            && el.absence_type === record.absence_type
            && el.servant_id === record.servant_id
        });
        return sameRecords.length > 0;
    }

    const generateAutoPull = () => {
        console.log(tempBook)
        let autoPull = tempBook.reduce((acc, el, index) => {
            let row = convertTempBookToPull(el);
            row.orderSection = "" + el.depart_order_no === "" + record.order_no ? "depart" : "arrive";
            if (!existInPull(row)
                && ("" + row.depart_order_no === "" + record.order_no
                    || "" + row.arrive_order_no === "" + record.order_no
                    || shouldReturn(row, record.order_date))) {
                row.id = index;
                row.order_no = record.order_no;
                row.order_date = record.order_date;
                if (row.orderSection === "arrive" && !row.fact_date_end) {
                    if (dateStringCompare(row.planned_date_end, record.order_date) === -1)
                        row.fact_date_end = dateToDatepickerString(
                            dateMath(row.planned_date_end,
                                (parseInt(row.trip_days) || 0) + !!(row.absence_type !== "mission")
                            ))
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
                    changedValues.planned_date_end = record.date_start;
                    changedValues.until_order = false;
                }
                break;
            case "until_order":
                    changedValues.day_count = 0;
                    changedValues.planned_date_end = "";
                    changedValues.single_day = false;
                break;
        }
        dispatch(setRecord(changedValues))
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

    const deleteFromTempbook = id => {
        setTempBook(tempBook.splice(id, 1))
    }

    const handleOtherPointChange = record => dispatch(setRecord(record))

    const getSimilarActivities = (absentServants, record, certificate) => {
        if (record.orderSection === "depart") return [];
        return absentServants.filter(absentServant => {
            return (
            absentServant.absence_type === record.absence_type
                && absentServant.servant_id === record.servant_id
                && (record.destination && absentServant.destination === record.destination)
                    || (!["medical_care", "medical_board"].includes(record.absence_type) &&
                        certificate && "" + absentServant.certificate === "" + certificate)
        )})
    }

    const submitMovementPoint = () => {
        let records = record.servants.map((el, ind) => {
            let similarActivities = getSimilarActivities(absentServants, record, record.certificate[ind]);
            let result = (similarActivities.length > 0)
                ? {
                    ...similarActivities[0],
                    fact_date_end: record.fact_date_end,
                    orderSection: record.orderSection,
                    order_no: record.order_no,
                    order_date: record.order_date,
                } : { ...record };
            result.servant_id = el;
            result.certificate = record.certificate[ind];
            result.certificate_issue_date = record.certificate_issue_date[ind];
            if (result.orderSection === "depart") result.fact_date_end = "";
            if (!result.id) {
                result.id = tempBook.length + ind;
                setTempBook(state => [ ...state, convertPullToTempBook(result) ]);
            }
            return result;
        });
        if (records.length > 0) return records;
        return [];
    }

    const submitOtherPoints = () => {
        let records = record.servants.map((el, ind) => {
            return {
                ...record,
                servant_id: el,
                certificate: record.certificate[ind],
                certificate_issue_date: record.certificate_issue_date[ind],
            }
        });
        if (records.length > 0) return records;
        return [];
    }

    const onSubmit = () => {
        let records;
        if (record.orderSection === "arrive" || record.orderSection === "depart") records = submitMovementPoint();
        else records = submitOtherPoints()
        dispatch(addRow(records));
        dispatch(resetRecord())
    }

    const SaveClauses = () => {
        const updatedTempBook = [ ...tempBook ];
        pull.filter(el => el.orderSection !== "other_points").forEach(el => {
            const tempBookRecordUpdates = convertPullToTempBook(el)
            if (el.id || el.id === 0)
                updatedTempBook[el.id] = { ...tempBook[el.id], ...tempBookRecordUpdates }
            else updatedTempBook.push(tempBookRecordUpdates)
        })

        const ipcRenderer = window.electron.ipcRenderer;
        ipcRenderer.invoke('save-temp-book', updatedTempBook.filter(el => el)).then(() => {
            setTempBook(updatedTempBook)
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
        <Grid padding="30px" direction={'column'} container spacing={2}>
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
                record={ record }
                handleChange={ handleChange }
                handleCheckBoxChange={ handleCheckBoxChange }
                handleMultipleValueChange={ handleMultipleValueChange }
                handleDateChange={ handleDateChange }
                addServant={ addServant }
                deleteServant={ deleteServant }
            /> }
            { record.orderSection === "depart" && <DeparturePage
                record={ record }
                handleChange={ handleChange }
                handleCheckBoxChange={ handleCheckBoxChange }
                handleMultipleValueChange={ handleMultipleValueChange }
                handleDateChange={ handleDateChange }
                addServant={ addServant }
                deleteServant={ deleteServant }
                absentServants={ absentServants }
            /> }
            { record.orderSection === "other_points" && <OtherPointsPage
                handleOtherPointChange={ handleOtherPointChange }
                record={ record }
            /> }
            <Grid container>
                <Button
                    variant="contained"
                    onClick={ onSubmit }>
                    Додати пункт
                </Button>
                <Button
                    variant="contained"
                    onClick={ SaveClauses }>
                    Зберегти пункти
                </Button>
                <Button
                    variant="contained"
                    onClick={ generateDirective }>
                    Згенерувати наказ
                </Button>
            </Grid>
            <Grid container>
                <PullViewer deleteFromTempbook={ deleteFromTempbook }/>
            </Grid>
        </Grid>
    )
}