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
import {  GenerateServantRankNameAndTitle } from "../../utilities/ServantsGenerators";
import { GenerateOrder } from "../../utilities/OrderGenerator";
import {
    dateToDatepickerString,
    dateMath,
    dateStringCompare,
    getDateDifference
} from "../../utilities/DateUtilities";
import {convertPullToTempBook, convertTempBookToPull} from "../../utilities/PullToTempBookConverter"
import {
    setRoles,
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
import { SERVANTS_SHEET, SERVANTS_VAR } from "../../dictionaries/constants";
import { getServantById } from "../../services/ServantsService";
import { tempBookHeadersMapToRaw } from "../../services/ExcelActions";

export default function MainScreen() {

    const dispatch = useDispatch();
    const record = useSelector(state => { return {...state.record } }, shallowEqual)
    const pull = useSelector(state => [ ...state.pull ], shallowEqual)
    const [ servants, setServantsState ] = useState([])
    const [ tempBook, setTempBook ] = useState([]);
    const [ absentServants, setAbsentServants ] = useState([]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.electron) {
            const ipcRenderer = window.electron.ipcRenderer;

            ipcRenderer.invoke('get-dict').then((result) => {
                dispatch(setRoles(result.roles));
                dispatch(setTitles(result.titles));
                dispatch(setDepartments(result.departments));
                dispatch(setServants(result.servants));
                setServantsState(result.servants);
            }).catch((err) => {
                console.error('Error fetching dictionary:', err);
            });

            ipcRenderer.invoke('get-temp-book').then((result) => {
                let newTempBookState = result
                    .filter(el => el.absence_type)
                    .map((el, ind) => {
                        el.id = ind;
                        return el;
                    });
                console.log("ТИМЧАСОВКА", newTempBookState);
                setTempBook(newTempBookState);
                setAbsentServants(result
                    .reduce((acc, el, ind)  => {
                        if (!el.absence_type) return acc;
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
            if (row.depart_order_no && "" + row.depart_order_no === "" + record.order_no) {
                row.orderSection = "depart";
                row.start_substituting = !!row.substituting_servants;
            } else {
                row.orderSection = "arrive";
                row.stop_substituting = !!row.substituting_servants;
            }
            if (!existInPull(row)
                && (row.depart_order_no && "" + row.depart_order_no === "" + record.order_no
                    || row.arrive_order_no && "" + row.arrive_order_no === "" + record.order_no
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

    const handleSettingsChange = event => {
        const field = event.target.name;
        const value = ["financial_support"].includes(field) ? event.target.checked : event.target.value
        dispatch(setRecord({ settings: {[field]: value} }))
    }

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
        const field = event.target.name;
        const value = ["start_substituting", "stop_substituting"].includes(field) ? event.target.checked : event.target.value
        dispatch(setRecordArray({
            field,
            index: ind,
            value
        }))
    }

    const addServant = () => {
        dispatch(addServantRecord())
    }

    const deleteServant = index => () => {
        dispatch(deleteServantRecord(index));
    }

    const deleteFromTempbook = id => {
        setTempBook(state => state.filter(el => el.id !== id))
    }

    const handleOtherPointChange = otherPoint => dispatch(setRecord({
        ...record,
        ...otherPoint,
        settings: { ...otherPoint.settings }
    }))

    const getSimilarActivities = (absentServants, servant_id, record, certificate) => {
        if (record.orderSection === "depart") return [];
        return absentServants.filter(absentServant => {
            return (
            absentServant.absence_type === record.absence_type
                && absentServant.servant_id === servant_id
                && (record.destination && absentServant.destination === record.destination)
                    || (!["medical_care", "medical_board"].includes(record.absence_type) &&
                        certificate && "" + absentServant.certificate === "" + certificate)
        )})
    }

    const submitMovementPoint = () => {
        let records = record.servants.map((el, ind) => {
            let similarActivities = getSimilarActivities(absentServants, el, record, record.certificate[ind]);
            let result = (similarActivities.length > 0)
                ? {
                    ...similarActivities[0],
                    orderSection: record.orderSection,
                    order_no: record.order_no,
                    order_date: record.order_date,
                } : { ...record };
            result.servant_id = el;
            result.start_substituting = !!record.start_substituting[ind];
            result.stop_substituting = !!record.stop_substituting[ind];
            result.substituting_servants = record.substituting_servants[ind];
            result.ration_certificate = record.ration_certificate;
            result.ration_certificate_issue_date = record.ration_certificate_issue_date;
            //  Don't want to add new columns though can't see a way to keep both prescription and certificate after arriving
            if (!["medical_care", "medical_board"].includes(record.absence_type) || record.orderSection === "depart") {
                result.certificate = record.certificate[ind];
                result.certificate_issue_date = record.certificate_issue_date[ind];
            }
            if (result.orderSection === "arrive") result.fact_date_end = record.fact_date_end;
            else result.fact_date_end = "";
            let newRecord = convertPullToTempBook(result);
            if (!result.id && result.id !== 0) {
                result.id = tempBook.length + ind;
                newRecord.id = tempBook.length + ind;
                setTempBook(state => [ ...state, newRecord ]);
            } else {
                newRecord.id = result.id
                setTempBook(state => state.map(tempBookRecord => tempBookRecord.id === newRecord.id
                    ? newRecord
                    : tempBookRecord)
                );
            }
            return result;
        });
        if (records.length > 0) return records;
        return [];
    }

    const submitOtherPoints = () => {
        let updatedServants;
        let records = record.servants.map((el, ind) => {
            const newPoint = {
                orderSection: record.orderSection,
                order_date: record.order_date,
                sectionType: record.sectionType,
                servant_id: el,
                certificate: record.certificate[ind],
                certificate_issue_date: record.certificate_issue_date[ind],
                settings: { ...record.settings }
            };
            if (record.sectionType === "reassignment") {
                const servant = getServantById(el)
                newPoint.settings.old_title_index = servant?.title_index;
                updatedServants = servants.map(el => {
                    if (el.id === record.servants[0]) {
                        return { ...el, title_index: record.settings.title_index };
                    } else return el;
                })
            }
            if (record.sectionType === "assignment") {
                let lastID = servants.at(-1).id;
                const servant = {
                    "id": parseInt(lastID) + 1,
                    "first_name_nominative": record.settings.first_name_nominative,
                    "first_name_genitive": record.settings.first_name_genitive,
                    "first_name_dative": record.settings.first_name_dative,
                    "first_name_accusative": record.settings.first_name_accusative,
                    "first_name_short": record.settings.first_name_short,
                    "last_name_nominative": record.settings.last_name_nominative,
                    "last_name_genitive": record.settings.last_name_genitive,
                    "last_name_dative": record.settings.last_name_dative,
                    "last_name_accusative": record.settings.last_name_accusative,
                    "rank": record.settings.rank,
                    "speciality": record.settings.speciality,
                    "gender": record.settings.gender,
                    "supplied_by": record.settings.supplied_by,
                    "title_index": record.settings.title_index,
                    "retired": "ні"
                }
                updatedServants = [ ...servants, servant ]
            }
            return newPoint;
        });
        if (updatedServants) {
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.invoke("save-dict", { dictionaryType: SERVANTS_VAR, dictionary: updatedServants })
                .then(() => {
                    dispatch(setServants(updatedServants));
                    setServantsState([ ...updatedServants ]);
                })
                .catch((err) => {
                    console.error(`Error saving ${SERVANTS_SHEET} dictionary:`, err);
                });
        }
        if (records.length > 0) return records;
        return [];
    }

    const onSubmit = () => {
        let records = ["arrive", "depart"].includes(record.orderSection) ? submitMovementPoint() : submitOtherPoints()
        dispatch(addRow(records));
        dispatch(resetRecord())
    }

    const SaveClauses = () => {
        const updatedTempBook = [ ...tempBook ];
        pull.forEach(el => {
            if (el.from_temp_book) {
                let existing = updatedTempBook.findIndex(tempBookRecord => tempBookRecord.id === el.id)
                if (existing !== -1)  updatedTempBook[existing] = convertPullToTempBook(el);
            }
        })
        const tempBookForSave = updatedTempBook.map(el => {
            const cleansedEl = {}
            for (let prop in tempBookHeadersMapToRaw) {
                cleansedEl[prop] = el[prop]
            }
            return cleansedEl;
        })
        const ipcRenderer = window.electron.ipcRenderer;
        ipcRenderer.invoke('save-temp-book', tempBookForSave.filter(el => el)).then(() => {
            setTempBook(tempBookForSave);
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

    console.log({ record, tempBook })

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
                {!record.servant ? "" : GenerateServantRankNameAndTitle(record.servant.id, "nominative")}
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
                handleSettingsChange={ handleSettingsChange }
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