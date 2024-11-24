import { Paper, TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Button } from "@mui/material";
import { GenerateRankAndName } from "../utilities/ServantsGenerators";
import { useDispatch, useSelector } from "react-redux";
import { removeRow, setRecord } from "../store";

const absence_type = require('../dictionaries/absence_types.json');
export default function PullViewer() {
    const dispatch = useDispatch();
    const pull = useSelector(state => state.pull)

    const removeFromPull = id => () => {
        dispatch(removeRow(id));
    }

    const editRow = id => () => {
        const record = { ...pull[id] };
        record.servants = [ record.servant_id ];
        record.certificate = [ record.certificate ];
        record.certificate_issue_date = [ record.certificate_issue_date ];
        dispatch(setRecord(record));
        dispatch(removeRow(id));
    }

    console.log(" PULL VIEWER", pull)
    const rows = pull.map(el => {
        console.log(el)
        const activity = el.orderSection === "arrive" ? "прибуття" : (el.orderSection === 'depart' ? 'вибуття' : 'інші пункти');
        const servant = GenerateRankAndName(el.servant_id, 'nominative');
        const destination = el.destination === '' ? 'Не релевантно' : el.destination;
        const absence = absence_type.find(item => item.value.toLowerCase() === el.absence_type.toLowerCase()).label ?? 'Не релевантно';
        const date_start = el.date_start;
        return { activity, servant, destination, absence, date_start }
    })

    return (
        <TableContainer component={ Paper }>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Пункти, що стосуються</TableCell>
                        <TableCell>Військовослужбовець/працівник ЗСУ</TableCell>
                        <TableCell>Тип відсутності</TableCell>
                        <TableCell>Куди</TableCell>
                        <TableCell>з</TableCell>
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
                            <TableCell>{ row.date_start || row.fact_date_end }</TableCell>
                            <TableCell>
                                <Button onClick={editRow(ind)}>Edit</Button>
                                <Button onClick={removeFromPull(ind)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}