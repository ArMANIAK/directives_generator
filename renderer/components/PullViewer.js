import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import { GenerateRankAndName } from "../utilities/ServantsGenerators";
import { useDispatch, useSelector } from "react-redux";
import { removeRow, setRecord } from "../store";
import { formatDate } from "../utilities/DateUtilities";

const viewerStyle = {
    height: "500px",
    marginTop: "10px",
    paddingTop: "10px",
    borderTop: "gray solid 1px",
    overflowY: "scroll"
}

const absence_type = require('../dictionaries/absence_types.json');

export default function PullViewer({ deleteFromTempbook }) {
    const dispatch = useDispatch();
    const pull = useSelector(state => state.pull)

    const removeFromPull = id => () => {
        dispatch(removeRow(id));
        deleteFromTempbook(id);
    }

    const editRow = id => () => {
        const record = { ...pull[id] };
        record.servants = [ record.servant_id ];
        record.certificate = [ record.certificate ];
        record.certificate_issue_date = [ record.certificate_issue_date ];
        dispatch(setRecord(record));
        dispatch(removeRow(id));
        deleteFromTempbook(id);
    }

    console.log(" PULL VIEWER", pull)
    const rows = pull.map(el => {
        let activity, date;
        if (el.orderSection === "arrive") {
            activity = "прибуття";
            date = formatDate(el.fact_date_end);
        }
        else if (el.orderSection === 'depart') {
            activity = 'вибуття';
            date = formatDate(el.date_start);
        } else {
            if (el.sectionType === 'financial_support')
                activity = "ГДО";
            else
                activity = 'інші пункти'
        }

        const servant = GenerateRankAndName(el.servant_id, 'nominative');
        const destination = !el.destination ? 'Не релевантно' : el.destination;
        const absence = el.orderSection === "other_points" ? ""
            : (absence_type.find(item => item.value.toLowerCase() === el.absence_type.toLowerCase())?.label ?? 'Не релевантно');
        return { activity, servant, destination, absence, date }
    })

    return (
        <TableContainer style={viewerStyle} component={ Paper }>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Пункти, що стосуються</TableCell>
                        <TableCell>Військовослужбовець/працівник ЗСУ</TableCell>
                        <TableCell>Тип відсутності</TableCell>
                        <TableCell>Куди</TableCell>
                        <TableCell>з/по</TableCell>
                        <TableCell>Дії</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row, ind) => (
                        <TableRow
                            key={ind}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                { row.activity }
                            </TableCell>
                            <TableCell>{ row.servant }</TableCell>
                            <TableCell>{ row.absence }</TableCell>
                            <TableCell>{ row.destination }</TableCell>
                            <TableCell>{ row.date }</TableCell>
                            <TableCell>
                                <Button onClick={editRow(ind)}>Редагувати</Button>
                                <Button onClick={removeFromPull(ind)}>Видалити</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}